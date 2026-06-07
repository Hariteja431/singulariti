export interface ConvertContent {
  howToUse: string[];
  faqs: { question: string; answer: string; }[];
}

const contentMap: Record<string, ConvertContent> = {
  'length-converter': {
    howToUse: [
      "Enter the length value you want to convert.",
      "Select your starting unit (e.g., Meters) from the 'From' dropdown.",
      "Select your target unit (e.g., Feet) from the 'To' dropdown.",
      "The exact length conversion will appear instantly."
    ],
    faqs: [
      { question: "Are these length conversions exact?", answer: "Yes, we use the international standard definitions. For instance, 1 inch is exactly defined as 25.4 millimeters." },
      { question: "Can I convert between Metric and Imperial?", answer: "Yes, you can cross-convert any supported metric and imperial length units seamlessly." }
    ]
  },
  'weight-converter': {
    howToUse: [
      "Input the weight or mass value.",
      "Choose the current unit (e.g., Kilograms or Pounds).",
      "Choose the unit you want to convert to.",
      "Use the Swap button to quickly reverse the calculation."
    ],
    faqs: [
      { question: "Is this measuring mass or weight?", answer: "Technically it measures mass (Kilograms, Grams) and weight (Pounds, Ounces), using standard Earth gravity constants for practical everyday conversions." },
      { question: "How many decimal places does it show?", answer: "The tool automatically formats up to 6 decimal places to ensure precision for tiny units like milligrams." }
    ]
  },
  'volume-converter': {
    howToUse: [
      "Type the volume amount in the input field.",
      "Select the base volume unit (e.g., Liters or Gallons).",
      "Select the desired output unit.",
      "The result updates automatically as you type."
    ],
    faqs: [
      { question: "Does this use US or UK Gallons?", answer: "The calculator currently uses standard US fluid gallons (where 1 US gallon ≈ 3.785 liters)." },
      { question: "Can I use this for cooking measurements?", answer: "Yes! It perfectly converts cups, quarts, and milliliters for recipe scaling." }
    ]
  },
  'area-converter': {
    howToUse: [
      "Enter the total area you wish to convert.",
      "Select your starting unit (like Square Meters or Acres).",
      "Select your target unit (like Hectares or Square Feet).",
      "Read your converted area instantly."
    ],
    faqs: [
      { question: "How large is a Hectare?", answer: "A hectare is exactly 10,000 square meters, or about 2.47 acres. It's the standard metric unit for large land areas." },
      { question: "Is this useful for real estate?", answer: "Absolutely. Real estate professionals frequently use it to convert between Square Feet and Acres." }
    ]
  },
  'speed-converter': {
    howToUse: [
      "Enter the current speed value.",
      "Choose the unit to convert from (e.g., km/h or mph).",
      "Choose the unit to convert to (e.g., m/s or Knots).",
      "Copy the converted speed directly."
    ],
    faqs: [
      { question: "What is a Knot?", answer: "A Knot is one nautical mile per hour, widely used in aviation and maritime navigation. 1 Knot is approximately 1.852 km/h." },
      { question: "How is m/s used?", answer: "Meters per second (m/s) is the standard SI unit for speed, primarily used in physics and engineering." }
    ]
  },
  'time-converter': {
    howToUse: [
      "Input the duration of time.",
      "Select the starting time scale (e.g., Seconds, Days, Weeks).",
      "Select the target time scale.",
      "The exact time equivalent will be displayed."
    ],
    faqs: [
      { question: "How many days are counted in a year?", answer: "For the sake of standard conversion, a year is calculated as exactly 365 days (31,536,000 seconds)." },
      { question: "Can I convert large units like Years into Seconds?", answer: "Yes, the tool handles massive multipliers perfectly without precision loss." }
    ]
  },
  'data-storage-converter': {
    howToUse: [
      "Enter the digital storage size.",
      "Select the starting unit (e.g., Megabytes or Gigabytes).",
      "Select the target unit (e.g., Bits or Terabytes).",
      "The storage equivalent updates in real-time."
    ],
    faqs: [
      { question: "Does this use Base-2 or Base-10 calculations?", answer: "This converter uses the Base-2 binary standard (1 KB = 1024 Bytes), which is the standard utilized by operating systems like Windows." },
      { question: "What is the difference between a Bit and a Byte?", answer: "A Byte consists of 8 Bits. Internet speeds are usually measured in Bits (Mbps), while file sizes are in Bytes (MB)." }
    ]
  },
  'angle-converter': {
    howToUse: [
      "Enter the angle measurement.",
      "Select the input format (Degrees, Radians, Gradians).",
      "Select the output format to view the conversion.",
      "Copy the calculated angle."
    ],
    faqs: [
      { question: "What is the formula for converting Degrees to Radians?", answer: "The formula is Radians = Degrees × (π / 180)." },
      { question: "When are Gradians used?", answer: "Gradians (where a right angle is 100 grads) are primarily used in surveying and civil engineering in certain regions." }
    ]
  },
  'pressure-converter': {
    howToUse: [
      "Input the pressure value.",
      "Select the unit you have (e.g., PSI, Bar, Pascal).",
      "Select the unit you want to convert to.",
      "View the accurate pressure result instantly."
    ],
    faqs: [
      { question: "What is the standard atmospheric pressure?", answer: "Standard atmospheric pressure (1 atm) is defined as exactly 101,325 Pascals, or roughly 14.7 PSI." },
      { question: "Is this useful for tire pressure?", answer: "Yes, you can easily convert tire pressure from PSI to Bar, which are the two most common automotive units." }
    ]
  },
  'energy-converter': {
    howToUse: [
      "Enter the energy or work value.",
      "Choose the current unit (e.g., Joules, Calories, kWh).",
      "Choose the output unit you need.",
      "The system handles the complex multipliers instantly."
    ],
    faqs: [
      { question: "What's the difference between Calories and Kilocalories?", answer: "Dietary 'Calories' found on food labels are actually Kilocalories (kcal). This tool supports both the physics cal and dietary kcal." },
      { question: "Can I use this for electricity bills?", answer: "Yes, you can convert between Joules, Watt-hours, and Kilowatt-hours (kWh) to understand power consumption." }
    ]
  },
  'power-converter': {
    howToUse: [
      "Enter the power measurement.",
      "Select your starting unit (e.g., Watts or Horsepower).",
      "Select the unit to convert to.",
      "The result is generated immediately."
    ],
    faqs: [
      { question: "What standard of Horsepower does this use?", answer: "The converter uses the mechanical (Imperial) horsepower standard, where 1 hp = 745.7 Watts." },
      { question: "Is a Kilowatt just 1000 Watts?", answer: "Yes, exactly. The 'kilo' prefix always means 1,000 in the SI metric system." }
    ]
  },
  'frequency-converter': {
    howToUse: [
      "Enter the frequency value.",
      "Select the starting wave unit (e.g., Hertz or Megahertz).",
      "Select the target scale (e.g., Gigahertz).",
      "Review the converted frequency."
    ],
    faqs: [
      { question: "What does Hertz measure?", answer: "Hertz (Hz) measures the number of cycles per second of a periodic phenomenon, like sound waves or computer processor clocks." },
      { question: "Can this convert CPU speeds?", answer: "Yes, you can easily convert processor speeds from GHz to MHz or Hz." }
    ]
  },
  'number-base-converter': {
    howToUse: [
      "Enter your starting number.",
      "Select its current numeral system (Decimal, Binary, Hexadecimal, etc.).",
      "Select the system you want to convert it to.",
      "The tool decodes and mathematically re-encodes the value."
    ],
    faqs: [
      { question: "Does it support letter characters?", answer: "Yes, when converting from or to Hexadecimal (Base 16), the letters A-F are fully supported and automatically formatted." },
      { question: "Is there a limit on number size?", answer: "It supports standard integer limits parsed by JavaScript. Extremely massive numbers might lose precision due to floating-point limits." }
    ]
  },
  'fuel-efficiency-converter': {
    howToUse: [
      "Enter your car's fuel economy value.",
      "Select the current unit (e.g., MPG or L/100km).",
      "Select the target format you want to understand.",
      "View the converted fuel efficiency."
    ],
    faqs: [
      { question: "Why is L/100km an inverse conversion?", answer: "Because MPG measures distance per volume, while L/100km measures volume per distance. The tool handles this inverse math automatically." },
      { question: "Does this use US or Imperial MPG?", answer: "This tool utilizes standard US Miles Per Gallon for its calculations." }
    ]
  },
  'temperature-converter': {
    howToUse: [
      "Type the temperature degree.",
      "Select the unit you are converting from (Celsius, Fahrenheit, or Kelvin).",
      "Select the unit you want to convert to.",
      "The scaled temperature will be displayed instantly."
    ],
    faqs: [
      { question: "Can I input negative numbers?", answer: "Yes, you can convert negative temperatures like -40°C seamlessly." },
      { question: "Is Absolute Zero supported?", answer: "Yes, the Kelvin scale starts at Absolute Zero (0 K). The tool will accurately map this to -273.15°C." }
    ]
  }
};

export function getConvertContent(toolId: string): ConvertContent {
  const data = contentMap[toolId];
  if (data) return data;
  
  // Fallback
  return {
    howToUse: [
      "Enter the value you want to convert.",
      "Select your input unit.",
      "Select your target unit.",
      "View your converted value instantly."
    ],
    faqs: [
      { question: "Is this free?", answer: "Yes, this converter is completely free to use." }
    ]
  };
}
