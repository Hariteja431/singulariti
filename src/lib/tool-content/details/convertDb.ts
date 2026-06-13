// Tool Details Database for convert category
export interface ToolDetailEntry {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

export const convertDetailsDb: Record<string, ToolDetailEntry> = {
  "length-converter": {
    whyNeed: "Scaling measurements between metric units and imperial values manually is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes distance inputs to meters and applies target multipliers client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Length Converter** when you need to convert length and distance measurements during checking shipping box lengths, homework projects, and travel distance audits.",
    stepByStep: ["Enter the length value.","Select source unit (meters, feet, inches, miles).","Select target unit and check converted value."],
    advantages: ["Translates distances across multiple metric and imperial units","Handles decimals and fractions accurately","Runs offline in browser cache"],
    commonMistakes: ["Selecting incorrect unit prefixes (e.g. confusing millimeters with micrometers)"],
    faqs: [{"q":"What units are supported?","a":"It supports standard units including km, meters, cm, mm, miles, yards, feet, and inches."}]
  },
  "weight-converter": {
    whyNeed: "Checking product weights or cooking measurements across metric and imperial scales is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes mass inputs to grams and converts them to target units client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Weight Converter** when you need to convert mass and weight measurements during checking shipping package weights, cooking recipe scales, and science projects.",
    stepByStep: ["Enter weight value.","Select source unit (kg, pounds, ounces, grams).","Convert and review the target mass value."],
    advantages: ["Converts mass values across metric and imperial systems","Displays multiple conversion values together","Runs locally securely"],
    commonMistakes: ["Confusing fluid ounces (volume) with dry ounces (weight/mass)"],
    faqs: [{"q":"Does it support metric tons?","a":"Yes, it supports conversions for metric tons, kilograms, grams, milligrams, pounds, and ounces."}]
  },
  "temperature-converter": {
    whyNeed: "Converting temperatures for weather, science, or cooking requires specific offset math.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies temperature formulas (Celsius, Fahrenheit, Kelvin) client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Temperature Converter** when you need to convert temperature scales during checking travel weather, science calculations, and recipe oven settings.",
    stepByStep: ["Enter the temperature value.","Select source scale (Celsius, Fahrenheit, Kelvin).","Check the converted temperature value instantly."],
    advantages: ["Supports Celsius, Fahrenheit, and Kelvin scales","Applies exact offsets and multipliers","Runs offline in browser cache"],
    commonMistakes: ["Entering temperatures below absolute zero (-273.15°C or 0 Kelvin), which are physically impossible"],
    faqs: [{"q":"What is absolute zero?","a":"It is the lowest possible temperature where all molecular motion stops, corresponding to 0 Kelvin or -273.15°C."}]
  },
  "area-converter": {
    whyNeed: "Comparing land properties or apartment sizes across square feet, acres, and hectares is difficult.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes area inputs to square meters and applies target multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Area Converter** when you need to convert area and surface measurements during comparing real estate sizes, checking land plots, and design projects.",
    stepByStep: ["Enter the area value.","Select source unit (sq ft, acres, hectares, sq meters).","Save the converted area value."],
    advantages: ["Converts land and surface areas across metric and imperial systems","Computes values instantly","Processed on-device privately"],
    commonMistakes: ["Confusing linear dimensions with square surface areas (e.g. 10 feet square vs 10 square feet)"],
    faqs: [{"q":"How many square feet are in an acre?","a":"There are exactly 43,560 square feet in one acre."}]
  },
  "volume-converter": {
    whyNeed: "Scaling cooking liquids or container volumes across gallons, liters, and cups is complex.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes volume inputs to liters and applies target multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Volume Converter** when you need to convert liquid and dry volume measurements during scaling kitchen recipes, checking liquid shipping volumes, and science projects.",
    stepByStep: ["Enter volume value.","Select source unit (liters, gallons, cups, milliliters).","Review converted volume value."],
    advantages: ["Converts volume across metric and imperial systems","Handles liquid and dry unit conversions","Runs locally securely"],
    commonMistakes: ["Confusing US liquid gallons with Imperial (UK) gallons, which have different volumes"],
    faqs: [{"q":"Does it convert US vs UK gallons?","a":"Standard calculations use the US liquid system, but you can select specific UK indicators if needed."}]
  },
  "speed-converter": {
    whyNeed: "Comparing travel speeds or wind velocities across km/h, mph, and knots is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes speed inputs to meters-per-second and applies multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Speed Converter** when you need to convert speed and velocity measurements during checking road speed limits, wind speeds, and aviation knots.",
    stepByStep: ["Enter speed value.","Select source unit (km/h, mph, knots, m/s).","Review converted speed value."],
    advantages: ["Converts speeds across road, marine, and scientific units","Applies standardized conversion constants","Runs offline securely"],
    commonMistakes: ["Selecting wrong units when calculating vehicle travel times"],
    faqs: [{"q":"What is a knot?","a":"A knot is a unit of speed equal to one nautical mile per hour, used in aviation and maritime navigation."}]
  },
  "time-converter": {
    whyNeed: "Converting years or weeks to hours or seconds manually requires long multiplication chains.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes time inputs to seconds and applies multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Time Converter** when you need to convert time durations across different scales during planning project durations, calculation logs, and timing checks.",
    stepByStep: ["Enter time value.","Select source unit (years, days, hours, minutes, seconds).","Review converted time values."],
    advantages: ["Converts durations across all time units simultaneously","Handles leap year assumptions correctly","Runs client-side privately"],
    commonMistakes: ["Ignoring leap years when calculating large durations in years"],
    faqs: [{"q":"How many seconds are in a day?","a":"There are exactly 86,400 seconds in a standard 24-hour day."}]
  },
  "data-storage-converter": {
    whyNeed: "Hard drive manufacturers measure in base-10, while operating systems measure in base-2, creating size discrepancies.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies base-2 (1024) or base-10 (1000) scale calculations client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Data Storage Converter** when you need to convert digital data storage units during checking file sizes, server storage planning, and bandwidth estimation.",
    stepByStep: ["Enter data value.","Select source unit (Bytes, KB, MB, GB, TB).","Review the converted data storage list."],
    advantages: ["Supports both binary (1024) and decimal (1000) data scales","Converts files size listings instantly","Runs offline securely"],
    commonMistakes: ["Confusing bits (lowercase 'b') with Bytes (uppercase 'B'); 1 Byte = 8 bits"],
    faqs: [{"q":"Why is a 1TB hard drive shown as 931GB in Windows?","a":"Drive makers define 1TB as 1,000,000,000,000 bytes. Windows calculates in binary base-1024, resulting in 931.3GB."}]
  },
  "fuel-efficiency-converter": {
    whyNeed: "Comparing import vehicle specs requires converting MPG to liters per 100km.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies reciprocal formulas to scale miles-per-gallon and liters-per-100km for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Fuel Efficiency Converter** when you need to convert vehicle fuel consumption rates during comparing vehicle fuel economies, car shopping, and trip budget logs.",
    stepByStep: ["Enter fuel efficiency value.","Select source scale (MPG, L/100km).","Review converted fuel efficiency rating."],
    advantages: ["Converts between distance-per-fuel and fuel-per-distance metrics","Supports US and UK gallons","Runs locally in browser RAM"],
    commonMistakes: ["Applying direct multiplication to reciprocal rates, which requires division math"],
    faqs: [{"q":"Why is L/100km reciprocal to MPG?","a":"L/100km measures how much fuel is used to cover a set distance, while MPG measures how far you can travel on a set amount of fuel."}]
  },
  "angle-converter": {
    whyNeed: "Engineering calculations require transitioning angles between degrees, radians, and gradians.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes angle inputs to radians and applies multipliers client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Angle Converter** when you need to convert geometric angle measurements during engineering calculations, math homework, and physics projects.",
    stepByStep: ["Enter angle value.","Select source unit (degrees, radians, gradians).","Review converted angle values."],
    advantages: ["Converts angles across degrees, radians, and gradians","Maintains high decimal precision","Runs offline in browser cache"],
    commonMistakes: ["Using degree mode for trigonometric formulas that expect radians"],
    faqs: [{"q":"How many degrees are in a radian?","a":"One radian is approximately equal to 57.2958 degrees."}]
  },
  "pressure-converter": {
    whyNeed: "Checking tire pressure or barometer readings across PSI, bar, and Pascals requires complex constants.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes pressure inputs to Pascals and applies multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Pressure Converter** when you need to convert physical pressure measurements during checking vehicle tire pressures, science experiments, and weather audits.",
    stepByStep: ["Enter pressure value.","Select source unit (PSI, bar, Pascals, atmospheres).","Review converted pressure values."],
    advantages: ["Converts pressure across engineering, weather, and metric units","Displays standard atmospheric constants","Processed on-device privately"],
    commonMistakes: ["Selecting wrong units, e.g. confusing millibar with bar"],
    faqs: [{"q":"What is standard atmospheric pressure?","a":"Standard atmospheric pressure at sea level is exactly 1 atm, which corresponds to 14.696 PSI or 101,325 Pascals."}]
  },
  "energy-converter": {
    whyNeed: "Comparing food nutrition calories with mechanical joules requires conversion factors.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes energy inputs to Joules and applies multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Energy Converter** when you need to convert energy, work, and heat units during dietary calorie comparisons, physics assignments, and electricity billing checks.",
    stepByStep: ["Enter energy value.","Select source unit (Joules, calories, kilowatt-hours, BTUs).","Review converted energy values."],
    advantages: ["Converts energy across mechanical, electrical, and thermal units","Supports food calories to Joules conversions","Runs locally securely"],
    commonMistakes: ["Confusing electricity usage terms, like mistaking kW for kWh"],
    faqs: [{"q":"How many Joules are in a food Calorie?","a":"One food Calorie (kilocalorie) is equal to approximately 4,184 Joules."}]
  },
  "power-converter": {
    whyNeed: "Comparing engine performance (horsepower) with electrical ratings (watts) requires standard scaling.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes power inputs to Watts and applies multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Power Converter** when you need to convert power and rate of work measurements during comparing vehicle horsepowers, electrical appliance audits, and physics projects.",
    stepByStep: ["Enter power value.","Select source unit (Watts, kilowatts, horsepower).","Review converted power values."],
    advantages: ["Converts power across mechanical and electrical units","Standardizes horsepower measurements","Runs offline securely"],
    commonMistakes: ["Confusing total energy consumption (kWh) with active power output (kW)"],
    faqs: [{"q":"How many Watts are in one horsepower?","a":"One mechanical horsepower is equal to approximately 745.7 Watts."}]
  },
  "frequency-converter": {
    whyNeed: "Aviation or radio communication checks require scaling frequencies across kHz, MHz, and GHz.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine normalizes frequency inputs to Hertz and applies multipliers for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Frequency Converter** when you need to convert frequency and wave cycles during tuning radio channels, checking processor clock speeds, and audio tuning.",
    stepByStep: ["Enter frequency value.","Select source unit (Hertz, kHz, MHz, GHz).","Review converted frequency values."],
    advantages: ["Converts frequencies from basic audio to radio bandwidths","Computes values instantly","Processed client-side safely"],
    commonMistakes: ["Entering invalid periods instead of cycles-per-second values"],
    faqs: [{"q":"What does Hertz measure?","a":"Hertz measures the number of cycles or repetitions of a wave per second."}]
  },
  "number-base-converter": {
    whyNeed: "Software developers and computer scientists frequently need to convert numbers between hexadecimal, binary, and decimal formats.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine parses input bases and stringifies them to target bases client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Number Base Converter** when you need to convert numerical bases (binary, octal, decimal, hexadecimal) during debugging memory addresses, coding hardware registers, and academic assignments.",
    stepByStep: ["Enter your number value.","Select source base (binary, octal, decimal, hex).","Review converted values across all four base systems."],
    advantages: ["Converts numbers across binary, octal, decimal, and hex simultaneously","Supports large integer inputs","Runs locally in browser RAM"],
    commonMistakes: ["Entering characters that are invalid in the selected base (e.g. typing '8' in binary)"],
    faqs: [{"q":"What is base-16?","a":"Base-16 (hexadecimal) is a numbering system that uses 16 symbols: 0-9 and A-F to represent values from 10 to 15."}]
  }
};
