import React, { useState, useEffect } from 'react';

const FractalExplorer = () => {
  const [activeFractal, setActiveFractal] = useState('sierpinski');
  const [iterations, setIterations] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [info, setInfo] = useState({
    elements: 0,
    pattern: "",
    complexity: "",
    dimension: ""
  });

  // Color palettes for different fractals
  const colorPalettes = {
    sierpinski: [
      "#FF5252", "#FF9800", "#FFEB3B", "#4CAF50", 
      "#2196F3", "#9C27B0", "#E91E63", "#FF5722",
      "#8BC34A", "#3F51B5", "#00BCD4"
    ],
    snowflake: [
      "#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", 
      "#42A5F5", "#2196F3", "#1E88E5", "#1976D2",
      "#1565C0", "#0D47A1", "#01579B"
    ],
    dragon: [
      "#f44336", "#e91e63", "#9c27b0", "#673ab7", 
      "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", 
      "#009688", "#4caf50", "#8bc34a"
    ]
  };

  useEffect(() => {
    const canvas = document.getElementById('fractalCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      
      // Set background
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      
      // Draw the selected fractal
      switch(activeFractal) {
        case 'sierpinski':
          drawSierpinskiFractal(ctx);
          break;
        case 'snowflake':
          drawSnowflakeFractal(ctx);
          break;
        case 'dragon':
          drawDragonFractal(ctx);
          break;
        default:
          drawSierpinskiFractal(ctx);
      }
    }
  }, [iterations, activeFractal, canvasSize]);

  // SIERPINSKI TRIANGLE FUNCTIONS
  const drawSierpinskiFractal = (ctx) => {
    // Calculate triangles and update info
    const triangleCount = Math.pow(3, iterations) - 1;
    setInfo({
      elements: triangleCount,
      pattern: "3^n - 1",
      complexity: getSierpinskiComplexity(iterations),
      dimension: "log(3)/log(2) ≈ 1.585"
    });
    
    // Start with an equilateral triangle
    const height = canvasSize.height - 40;
    const width = canvasSize.width - 40;
    const margin = 20;
    
    const p1 = { x: width / 2 + margin, y: margin };
    const p2 = { x: margin, y: height + margin };
    const p3 = { x: width + margin, y: height + margin };
    
    drawSierpinskiTriangle(ctx, p1, p2, p3, iterations, 0);
  };

  const drawTriangle = (ctx, p1, p2, p3, depth) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    
    // Choose color based on depth
    const colorIndex = depth % colorPalettes.sierpinski.length;
    ctx.fillStyle = colorPalettes.sierpinski[colorIndex];
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  };

  const drawSierpinskiTriangle = (ctx, p1, p2, p3, depth, currentDepth) => {
    if (depth === 0) {
      drawTriangle(ctx, p1, p2, p3, currentDepth);
      return;
    }

    // Calculate midpoints
    const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
    const mid3 = { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 };

    // Recursive calls for the three corner triangles
    drawSierpinskiTriangle(ctx, p1, mid1, mid3, depth - 1, currentDepth + 1);
    drawSierpinskiTriangle(ctx, mid1, p2, mid2, depth - 1, currentDepth + 1);
    drawSierpinskiTriangle(ctx, mid3, mid2, p3, depth - 1, currentDepth + 1);
  };

  // KOCH SNOWFLAKE FUNCTIONS
  const drawSnowflakeFractal = (ctx) => {
    // Calculate segments and update info
    const segmentCount = Math.pow(4, iterations) * 3;
    setInfo({
      elements: segmentCount,
      pattern: "4^n × 3",
      complexity: getSnowflakeComplexity(iterations),
      dimension: "log(4)/log(3) ≈ 1.262"
    });
    
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const radius = Math.min(canvasSize.width, canvasSize.height) * 0.45;
    
    // Draw the Koch snowflake
    drawKochSnowflake(ctx, centerX, centerY, radius, iterations);
  };

  const drawKochSnowflake = (ctx, centerX, centerY, radius, iterations) => {
    // Clear the background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Calculate points for the initial triangle
    const points = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI / 3) - (Math.PI / 2); // Start from top
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
    
    // Draw the Koch snowflake
    ctx.beginPath();
    
    // Start at the first point
    ctx.moveTo(points[0].x, points[0].y);
    
    // Draw each side
    for (let i = 0; i < 3; i++) {
      const start = points[i];
      const end = points[(i + 1) % 3];
      
      // Draw a Koch curve for this side
      drawKochCurve(ctx, start, end, iterations);
    }
    
    ctx.closePath();
    
    // Fill with a very light color
    ctx.fillStyle = "rgba(230, 240, 255, 0.2)";
    ctx.fill();
    
    // Adjust line width based on iteration number
    let lineWidth;
    if (iterations >= 5) {
      lineWidth = 0.5;
    } else if (iterations >= 4) {
      lineWidth = 1;
    } else {
      lineWidth = 2;
    }
    
    ctx.strokeStyle = "#0056b3";
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const drawKochCurve = (ctx, p1, p2, depth) => {
    if (depth === 0) {
      // For the base case, just draw a straight line
      ctx.lineTo(p2.x, p2.y);
      return;
    }
    
    // Divide the line into thirds
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    
    // Calculate the four points for the Koch curve
    const p3 = { 
      x: p1.x + dx / 3, 
      y: p1.y + dy / 3 
    };
    
    const p4 = { 
      x: p1.x + dx / 2 + Math.sqrt(3) * dy / 6, 
      y: p1.y + dy / 2 - Math.sqrt(3) * dx / 6 
    };
    
    const p5 = { 
      x: p1.x + 2 * dx / 3, 
      y: p1.y + 2 * dy / 3 
    };
    
    // Draw the four parts of the Koch curve
    drawKochCurve(ctx, p1, p3, depth - 1);
    drawKochCurve(ctx, p3, p4, depth - 1);
    drawKochCurve(ctx, p4, p5, depth - 1);
    drawKochCurve(ctx, p5, p2, depth - 1);
  };

  // DRAGON CURVE FUNCTIONS
  const drawDragonFractal = (ctx) => {
    // Calculate number of segments
    const segmentCount = Math.pow(2, iterations);
    setInfo({
      elements: segmentCount,
      pattern: "2^n segments",
      complexity: getDragonComplexity(iterations),
      dimension: "~2 (space-filling)"
    });
    
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    
    // Draw the Heighway dragon curve
    drawHeighwayDragon(ctx, centerX, centerY, iterations);
  };

  const drawHeighwayDragon = (ctx, centerX, centerY, iterations) => {
    // Clear the canvas and set background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    // If iteration is 0, just draw a single line segment
    if (iterations === 0) {
      const lineLength = Math.min(canvasSize.width, canvasSize.height) * 0.5;
      ctx.beginPath();
      ctx.moveTo(centerX - lineLength/2, centerY);
      ctx.lineTo(centerX + lineLength/2, centerY);
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 3;
      ctx.stroke();
      return;
    }
    
    // Initial segment directions, representing right (1) and left (-1) turns
    let directions = [1];
    
    // Generate the dragon curve pattern using binary representation method
    for (let i = 1; i < iterations; i++) {
      const currentLength = directions.length;
      directions.push(1); // Add a right turn
      for (let j = currentLength - 1; j >= 0; j--) {
        directions.push(-directions[j]); // Add reversed and negated
      }
    }
    
    // Scale factor: each segment is scaled by 1/sqrt(2) from the previous
    const scaleFactor = 1 / Math.sqrt(2);
    
    // For higher iterations, we need to zoom out significantly more
    // These zoom factors ensure the entire fractal is visible at each iteration
    const zoomFactors = {
      0: 0.5,    // Base size for iteration 0
      1: 0.4,    // Slightly smaller for iteration 1
      2: 0.3,    // More reduction for iteration 2
      3: 0.25,   // Further reduction for iteration 3
      4: 0.2,    // Continued reduction for iteration 4
      5: 0.14,   // Significant reduction starts here
      6: 0.09,   // Much smaller for iteration 6
      7: 0.06,   // Very small for iteration 7
      8: 0.04,   // Tiny for iteration 8
      9: 0.025,  // Extremely small for iteration 9
      10: 0.016, // Microscopic for iteration 10
      11: 0.01,  // Even smaller for iteration 11
      12: 0.006  // Tiniest size for iteration 12
    };
    
    // Get the appropriate zoom factor for the current iteration
    const zoom = zoomFactors[iterations] || 0.006;
    const baseSize = Math.min(canvasSize.width, canvasSize.height) * zoom;
    
    // Calculate the segment length based on iterations
    let segmentLength = baseSize;
    
    // Pre-compute the full path to determine bounding box for centering
    const points = [];
    let x = 0, y = 0;
    let angle = 0;
    
    // Starting point
    points.push({x, y});
    
    // Trace the path to find all points
    for (let i = 0; i <= directions.length; i++) {
      // Move forward in current direction
      x += segmentLength * Math.cos(angle);
      y += segmentLength * Math.sin(angle);
      points.push({x, y});
      
      // Change direction if not at the end
      if (i < directions.length) {
        angle += directions[i] * Math.PI/2;
      }
    }
    
    // Find bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const point of points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
    
    // Calculate centering offsets
    const width = maxX - minX;
    const height = maxY - minY;
    const offsetX = centerX - (minX + maxX) / 2;
    const offsetY = centerY - (minY + maxY) / 2;
    
    // Draw the dragon curve centered in the canvas
    ctx.beginPath();
    ctx.moveTo(points[0].x + offsetX, points[0].y + offsetY);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x + offsetX, points[i].y + offsetY);
    }
    
    // Style and draw the path
    ctx.strokeStyle = "#FF0000";
    
    // Adjust line width based on iteration to keep it visible at high zoom-out levels
    let lineWidth;
    if (iterations <= 3) {
      lineWidth = 3 - iterations * 0.25;
    } else if (iterations <= 6) {
      lineWidth = 2;
    } else {
      lineWidth = 3; // Make line thicker for high iterations to remain visible
    }
    
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Removed text overlay for high iterations
  };

  // UTILITY FUNCTIONS
  const getSierpinskiComplexity = (n) => {
    const descriptions = [
      "Simple - Just a single triangle",
      "Basic - The first iteration showing the fractal pattern",
      "Developing - The pattern becomes clearer",
      "Complex - Self-similarity is now apparent",
      "Very Complex - Detailed fractal structure",
      "Extremely Complex - Fine detail becoming visible",
      "Incredibly Complex - Intricate patterns within patterns",
      "Mathematical Beauty - Approaching theoretical perfection",
      "Mesmerizing Detail - Tiny triangles everywhere",
      "Nearly Infinite - Approaching theoretical limits",
      "Mathematical Perfection - Beyond typical visualization"
    ];
    
    return descriptions[Math.min(n, descriptions.length - 1)];
  };
  
  const getSnowflakeComplexity = (n) => {
    const descriptions = [
      "Simple - Just a triangle outline",
      "Basic - The first bumps appear",
      "Developing - Star-like shape emerges",
      "Complex - The snowflake pattern forms",
      "Very Complex - Detailed crystalline structure",
      "Extremely Complex - Fine details on all edges",
      "Incredibly Complex - Intricate edge patterns",
      "Mathematical Beauty - Approaching infinite perimeter",
      "Mesmerizing Detail - Countless tiny bumps",
      "Nearly Infinite - The perimeter grows dramatically",
      "Mathematical Perfection - Beyond typical visualization"
    ];
    
    return descriptions[Math.min(n, descriptions.length - 1)];
  };
  
  const getDragonComplexity = (n) => {
    const descriptions = [
      "Simple - Just a line segment",
      "Basic - First fold creates two segments",
      "Developing - Four segments with right angles",
      "Complex - Eight segments, dragon pattern emerging",
      "Very Complex - Self-similarity becoming clear",
      "Extremely Complex - Fractal structure visible",
      "Incredibly Complex - Fine details appearing",
      "Mathematical Beauty - Space-filling properties emerging",
      "Detailed Pattern - Intricate fractal structure",
      "Near Complete - Complex geometric pattern",
      "Advanced Structure - Highly developed pattern",
      "Extreme Detail - Microscopic structure visible",
      "True Dragon - The complete Heighway Dragon fractal"
    ];
    
    return descriptions[Math.min(n, descriptions.length - 1)];
  };

  return (
    <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg shadow-lg max-w-md">
      <h1 className="text-xl font-bold mb-2 text-purple-800">Fractal Explorer</h1>
      
      {/* Fractal selection tabs */}
      <div className="flex mb-3 bg-white rounded-lg shadow-md overflow-hidden w-full">
        <button 
          className={`flex-1 py-2 px-2 text-center font-medium text-sm ${activeFractal === 'sierpinski' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          onClick={() => {
            setActiveFractal('sierpinski');
            setIterations(0);
          }}
        >
          Sierpinski Triangle
        </button>
        <button 
          className={`flex-1 py-2 px-2 text-center font-medium text-sm ${activeFractal === 'snowflake' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          onClick={() => {
            setActiveFractal('snowflake');
            setIterations(0);
          }}
        >
          Koch Snowflake
        </button>
        <button 
          className={`flex-1 py-2 px-2 text-center font-medium text-sm ${activeFractal === 'dragon' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          onClick={() => {
            setActiveFractal('dragon');
            setIterations(0);
          }}
        >
          Heighway Dragon
        </button>
      </div>
      
      {/* Iteration slider (simplified) */}
      <div className="mb-3 w-full">
        <input
          type="range"
          min="0"
          max={activeFractal === 'dragon' ? 12 : 7}
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {/* Canvas */}
      <div className="bg-white p-2 rounded-lg shadow-md">
        <canvas 
          id="fractalCanvas" 
          width={canvasSize.width} 
          height={canvasSize.height}
          className="border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default FractalExplorer;