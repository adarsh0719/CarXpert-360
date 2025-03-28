import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

const COMPONENT_COSTS = {
  car: { base: 500, multiplier: 2.5 },
  truck: { base: 800, multiplier: 3 },
  bus: { base: 1200, multiplier: 4 },
  tire: { base: 200, multiplier: 1.5 },
  bumper: { base: 450, multiplier: 2 },
  door: { base: 600, multiplier: 2.2 }
};

const DAMAGE_SPECIFIC_PARTS = {
  door: {
    dent: [
      { name: 'Door Skin Panel', price: '$280', link: '#', severity: 'High' },
      { name: 'Door Frame Reinforcement', price: '$150', link: '#', severity: 'Medium' }
    ],
    scratch: [
      { name: 'Door Touch-Up Paint Kit', price: '$45', link: '#', severity: 'Low' },
      { name: 'Door Handle Cover', price: '$35', link: '#', severity: 'Low' }
    ],
    crack: [
      { name: 'Complete Door Assembly', price: '$650', link: '#', severity: 'High' },
      { name: 'Window Regulator Kit', price: '$120', link: '#', severity: 'Medium' }
    ]
  },
  bumper: {
    dent: [
      { name: 'Bumper Cover Replacement', price: '$300', link: '#', severity: 'Medium' },
      { name: 'Bumper Support Bracket', price: '$85', link: '#', severity: 'Low' }
    ],
    crack: [
      { name: 'Complete Bumper Assembly', price: '$450', link: '#', severity: 'High' },
      { name: 'Bumper Reinforcement Bar', price: '$180', link: '#', severity: 'Medium' }
    ]
  },
  tire: {
    crack: [
      { name: 'All-Season Replacement Tire', price: '$150', link: '#', severity: 'High' },
      { name: 'Run-Flat Tire', price: '$220', link: '#', severity: 'High' }
    ],
    scratch: [
      { name: 'Tire Sealant Kit', price: '$35', link: '#', severity: 'Low' },
      { name: 'Wheel Cover Set', price: '$60', link: '#', severity: 'Low' }
    ]
  },
  car: {
    dent: [
      { name: 'Quarter Panel Replacement', price: '$400', link: '#', severity: 'High' },
      { name: 'Body Filler Kit', price: '$55', link: '#', severity: 'Low' }
    ],
    crack: [
      { name: 'Windshield Replacement', price: '$350', link: '#', severity: 'High' },
      { name: 'Headlight Assembly', price: '$180', link: '#', severity: 'Medium' }
    ]
  }
};

const DamageDetector = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [results, setResults] = useState({
    costEstimate: '-',
    severityLevel: '-',
    componentsList: '-',
    damageArea: '-',
    damageOverlays: [],
    damageTypes: [],
    suggestedParts: []
  });

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    };
    loadModel();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-600');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-600');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-600');
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) loadImage(file);
  };

  const loadImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setResults({
        costEstimate: '-',
        severityLevel: '-',
        componentsList: '-',
        damageArea: '-',
        damageOverlays: [],
        damageTypes: [],
        suggestedParts: []
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageLoad = () => {
    const img = imageRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    let targetWidth = naturalWidth;
    let targetHeight = naturalHeight;

    if (isMobile && naturalWidth > 800) {
      targetWidth = 800;
      targetHeight = (naturalHeight * 800) / naturalWidth;
    }

    const canvas = canvasRef.current;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    setImageDimensions({ width: targetWidth, height: targetHeight });
  };

  const classifyDamage = (component) => {
    const damageTypes = [];
    const componentArea = component.bbox[2] * component.bbox[3];
    const totalArea = imageDimensions.width * imageDimensions.height;
    const widthThreshold = imageDimensions.width * 0.05;

    if (component.score > (isMobile ? 0.65 : 0.7)) damageTypes.push('dent');
    if (componentArea > totalArea * 0.03) damageTypes.push('crack');
    if (component.bbox[2] < widthThreshold && component.score > (isMobile ? 0.45 : 0.5)) {
      damageTypes.push('scratch');
    }

    return damageTypes;
  };

  const getDamageSpecificParts = (componentType, damageTypes) => {
    const componentParts = DAMAGE_SPECIFIC_PARTS[componentType] || {};
    const matchedParts = [];
    const addedParts = new Set();

    damageTypes.forEach(damage => {
      (componentParts[damage] || []).forEach(part => {
        if (!addedParts.has(part.name)) {
          matchedParts.push(part);
          addedParts.add(part.name);
        }
      });
    });

    return matchedParts.sort((a, b) => 
      a.severity === 'High' ? -1 : b.severity === 'High' ? 1 : 0
    );
  };

  const analyzeDamage = async () => {
    if (!model || !imageSrc) return;

    setIsLoading(true);
    setResults(prev => ({ ...prev, damageOverlays: [] }));

    try {
      const predictions = await model.detect(canvasRef.current);
      const scoreThreshold = isMobile ? 0.5 : 0.6;
      const severityThreshold = isMobile ? 0.35 : 0.4;
      const vehicleComponents = predictions.filter(p => 
        Object.keys(COMPONENT_COSTS).includes(p.class.toLowerCase()) && p.score >= scoreThreshold
      );

      const damageTypesMap = new Map();
      const suggestedParts = [];
      const partsCache = new Set();
      let totalCost = 0;
      let totalArea = 0;
      const detectedComponents = new Set();
      const overlays = [];

      vehicleComponents.forEach(component => {
        const componentType = component.class.toLowerCase();
        const costData = COMPONENT_COSTS[componentType];
        const componentArea = component.bbox[2] * component.bbox[3];
        const areaRatio = componentArea / (imageDimensions.width * imageDimensions.height);
        const severity = component.score * 0.7 + (areaRatio * 0.3);

        if (severity >= severityThreshold) {
          totalCost += costData.base + (costData.multiplier * severity * 100);
          totalArea += componentArea;
          detectedComponents.add(componentType);

          const componentDamageTypes = classifyDamage(component);
          damageTypesMap.set(componentType, componentDamageTypes);

          const damageParts = getDamageSpecificParts(componentType, componentDamageTypes);
          damageParts.forEach(part => {
            if (!partsCache.has(part.name)) {
              suggestedParts.push(part);
              partsCache.add(part.name);
            }
          });

          overlays.push({
            left: (component.bbox[0] / imageDimensions.width) * 100,
            top: (component.bbox[1] / imageDimensions.height) * 100,
            width: (component.bbox[2] / imageDimensions.width) * 100,
            height: (component.bbox[3] / imageDimensions.height) * 100
          });
        }
      });

      const severityLevel = totalCost > 2000 ? 'High' :
                          totalCost > 1000 ? 'Medium' : 'Low';

      setResults({
        costEstimate: totalCost > 0 ? `$${Math.round(totalCost)}` : '$0',
        componentsList: Array.from(detectedComponents).join(', ') || 'None',
        damageArea: `${Math.round((totalArea / (imageDimensions.width * imageDimensions.height)) * 100)}%`,
        severityLevel,
        damageOverlays: overlays,
        damageTypes: Array.from(new Set([...damageTypesMap.values()].flat())),
        suggestedParts: suggestedParts.slice(0, 4)
      });

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing image. Please try again.');
    }
    setIsLoading(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    let yPos = 40;

    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('Vehicle Damage Report', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Report Date: ${date}`, 20, 30);

    autoTable(doc, {
      startY: yPos,
      head: [['Assessment', 'Details']],
      body: [
        ['Estimated Repair Cost', results.costEstimate],
        ['Damage Severity', results.severityLevel],
        ['Affected Components', results.componentsList],
        ['Damage Area Coverage', results.damageArea]
      ],
      theme: 'grid',
      styles: { fontSize: 12, cellPadding: 8, halign: 'left' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 'auto' } }
    });
    yPos = doc.lastAutoTable.finalY + 10;

    if (results.damageTypes.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Detected Damage Types']],
        body: [[results.damageTypes.join(', ')]],
        theme: 'grid',
        styles: { fontSize: 12, cellPadding: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    }

    if (results.suggestedParts.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [['Recommended Part', 'Price', 'Severity']],
        body: results.suggestedParts.map(part => [part.name, part.price, part.severity]),
        theme: 'grid',
        styles: { fontSize: 12, cellPadding: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 
          0: { cellWidth: 100 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 }
        }
      });
    }

    doc.save(`damage-report-${Date.now()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
          Vehicle Damage Detection
        </h1>

        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-blue-600 hover:bg-gray-50 relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-600 mb-4">📁 Drag & Drop or Click to Upload Car Image</p>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
          />
          {imageSrc && (
            <div className="relative mx-auto max-w-3xl">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Preview"
                className="max-w-full h-auto rounded-lg shadow-lg mt-4"
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <svg
                      className="animate-spin h-12 w-12 text-white mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="mt-2 font-medium">Analyzing Damage...</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0">
                {results.damageOverlays.map((overlay, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-red-600 bg-red-100/10"
                    style={{
                      left: `${overlay.left}%`,
                      top: `${overlay.top}%`,
                      width: `${overlay.width}%`,
                      height: `${overlay.height}%`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={analyzeDamage}
            disabled={isLoading || !imageSrc}
          >
            🔍 Analyze Damage
          </button>

          {results.costEstimate !== '-' && (
            <button 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              onClick={generatePDF}
            >
              📄 Download Report
            </button>
          )}
        </div>

        {results.costEstimate !== '-' && (
          <div className="mt-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">📄 Damage Report</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Detected Damage Types</h3>
              <div className="flex gap-2 flex-wrap">
                {results.damageTypes.map((type, index) => (
                  <span key={index} className="px-4 py-2 bg-red-100 text-red-800 rounded-full capitalize text-sm">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Recommended Replacement Parts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.suggestedParts.map((part, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{part.name}</h4>
                        <p className="text-blue-600 font-semibold my-2">{part.price}</p>
                        <span className={`px-2 py-1 text-xs rounded ${
                          part.severity === 'High' ? 'bg-red-100 text-red-800' :
                          part.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {part.severity} Priority
                        </span>
                      </div>
                      <a href={part.link} className="text-sm text-gray-600 hover:underline inline-block">
                        View Details →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-gray-600 font-medium mb-2">💰 Estimated Repair Cost</h3>
                <p className="text-2xl font-bold text-gray-800">{results.costEstimate}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-gray-600 font-medium mb-2">⚠️ Damage Severity</h3>
                <p className="text-2xl font-bold text-gray-800">{results.severityLevel}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-gray-600 font-medium mb-2">🔧 Affected Components</h3>
                <p className="text-xl font-medium text-gray-800">{results.componentsList}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-gray-600 font-medium mb-2">📏 Damage Area</h3>
                <p className="text-2xl font-bold text-gray-800">{results.damageArea}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageDetector;