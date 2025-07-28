
const fs = require('fs');

function decodeValueFromBase(base, value) {

    return BigInt(parseInt(value, base));
}

function calculateLagrangeInterpolation(points) {
    const numberOfPoints = points.length; 
    let interpolatedValueAtZero = 0n; 

    for (let i = 0; i < numberOfPoints; i++) {
        let currentX = BigInt(points[i].x); 
        let currentY = points[i].y; 

        let numerator = 1n;
        let denominator = 1n; 

        for (let j = 0; j < numberOfPoints; j++) {
            if (i === j) continue; 
            let otherX = BigInt(points[j].x);
            numerator *= -otherX; 
            denominator *= (currentX - otherX); 
        }

    
        let currentTerm = currentY * numerator / denominator;
        interpolatedValueAtZero += currentTerm; 
    }

    return interpolatedValueAtZero;
}

function extractPointsFromJSON(filePath) {
    const rawData = fs.readFileSync(filePath); 
    const jsonData = JSON.parse(rawData);

    const numberOfPointsToExtract = jsonData.keys.k; 
    let pointsArray = []; 

    
    for (const key in jsonData) {
        if (key === "keys") continue; 
        const xValue = parseInt(key); 
        const baseValue = parseInt(jsonData[key].base); 
        const yValue = decodeValueFromBase(baseValue, jsonData[key].value); 
        pointsArray.push({ x: xValue, y: yValue }); 
    }

    pointsArray.sort((a, b) => a.x - b.x);
    return pointsArray.slice(0, numberOfPointsToExtract);
}


const testCase1Points = extractPointsFromJSON('test_case_1.json'); 
const testCase2Points = extractPointsFromJSON('test_case_2.json'); 

const secretValue1 = calculateLagrangeInterpolation(testCase1Points); 
const secretValue2 = calculateLagrangeInterpolation(testCase2Points); 


console.log(`Secret for Test Case 1: ${secretValue1}`);
console.log(`Secret for Test Case 2: ${secretValue2}`);
