// Tool Details Database for calculators category
export interface ToolDetailEntry {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

export const calculatorsDetailsDb: Record<string, ToolDetailEntry> = {
  "emi-calculator": {
    whyNeed: "Estimating monthly loan payments with varying interest rates manually is complex.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies standard reducing balance amortization equations for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **EMI Calculator** when you need to calculate Equated Monthly Installments (EMI) for loans during planning home loans, car loans, and business financing repayments.",
    stepByStep: ["Enter the loan principal sum.","Enter the annual interest rate.","Select the loan tenure in years or months.","Review the monthly EMI amount and amortization schedule."],
    advantages: ["Generates detailed monthly amortization schedules","Displays total interest and principal splits","Runs client-side in RAM safely"],
    commonMistakes: ["Entering incorrect compounding tenures"],
    faqs: [{"q":"What is an amortization schedule?","a":"It is a table showing the month-by-month breakdown of how much of your payment goes to interest vs principal."}]
  },
  "sip-calculator": {
    whyNeed: "Calculating the future value of monthly mutual fund investments manually is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies compounding interest formulas to regular monthly cash flows for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **SIP Calculator** when you need to project wealth returns from Systematic Investment Plans (SIP) during projecting retirement funds, wealth planning, and mutual fund SIP checks.",
    stepByStep: ["Enter the monthly SIP investment amount.","Enter the expected annual return percentage.","Set the duration of the SIP in years.","Review estimated returns and total wealth gains."],
    advantages: ["Calculates compounding interest on regular monthly deposits","Displays visual growth charts","100% secure client-side calculation"],
    commonMistakes: ["Expecting guaranteed returns since investments are subject to market changes"],
    faqs: [{"q":"What is the formula used?","a":"The calculator uses the standard future value formula for annuity compounding."}]
  },
  "compound-interest-calculator": {
    whyNeed: "Compounding interest variables (monthly, quarterly, yearly) manually is slow and error-prone.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies compound interest formulas with custom compounding intervals for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Compound Interest Calculator** when you need to calculate compound interest yields over time during estimating savings account growth, mutual fund projections, and bond yields.",
    stepByStep: ["Input initial principal sum.","Enter annual interest rate and tenure.","Select compounding frequency (monthly, quarterly, annually).","Review compound interest and total maturity balances."],
    advantages: ["Supports multiple compounding intervals","Shows year-on-year growth logs","Runs offline securely"],
    commonMistakes: ["Confusing annual interest rates with monthly yields"],
    faqs: [{"q":"What is compounding frequency?","a":"It is how often interest is calculated and added to the principal. More frequent compounding yields higher returns."}]
  },
  "cagr-calculator": {
    whyNeed: "Comparing historical investment returns across different periods requires a standardized CAGR metric.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine evaluates annualized geometric growth rates client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **CAGR Calculator** when you need to compute the Compound Annual Growth Rate (CAGR) of investments during comparing mutual fund performance, stock growth rates, and real estate returns.",
    stepByStep: ["Enter the starting value of the investment.","Enter the ending value of the investment.","Set the duration in years.","Review the annualized percentage growth rate."],
    advantages: ["Standardizes returns over uneven multi-year periods","Allows direct comparison between asset classes","Processed locally in browser memory"],
    commonMistakes: ["Using CAGR to project volatile returns without factoring in market drops"],
    faqs: [{"q":"How does CAGR differ from average return?","a":"Average return ignores compounding, whereas CAGR represents the steady annual rate at which the investment grew."}]
  },
  "fd-calculator": {
    whyNeed: "Determining FD yields across multiple tenures manually requires complex formulas.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies standard FD interest formulas with quarterly compounding for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **FD Calculator** when you need to calculate Fixed Deposit (FD) maturity values during investing in bank fixed deposits and checking interest gains.",
    stepByStep: ["Enter deposit principal.","Type expected annual interest rate.","Specify tenure (days, months, or years).","Check maturity amount and total interest earned."],
    advantages: ["Uses standardized quarterly compounding used by banks","Calculates yields for flexible tenures","Runs client-side securely"],
    commonMistakes: ["Selecting incorrect compounding settings, as bank FDs compound quarterly by default"],
    faqs: [{"q":"Does this account for tax deductions (TDS)?","a":"No, this calculator shows pre-tax interest returns."}]
  },
  "roi-calculator": {
    whyNeed: "Evaluating the efficiency of capital allocations across projects requires a simple ROI indicator.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine computes total and annualized investment gains for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **ROI Calculator** when you need to calculate Return on Investment (ROI) and annualized metrics during evaluating business returns, property investments, and stock gains.",
    stepByStep: ["Enter the amount invested.","Enter the final return value.","Review the absolute ROI percentage and total profit."],
    advantages: ["Displays absolute profit and ROI ratios","Supports annualized ROI options","Runs offline securely"],
    commonMistakes: ["Ignoring the time factor when comparing absolute ROIs of different investments"],
    faqs: [{"q":"What is a good ROI?","a":"A good ROI depends on the asset class and risk level, but standard benchmarks range from 7% to 10% annually."}]
  },
  "currency-converter": {
    whyNeed: "Matching shopping prices or business budgets in foreign currencies manually is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine fetches exchange rates (if online) and calculates currency splits locally for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Currency Converter** when you need to convert currency values across global exchange rates during checking travel budgets, online shopping, and international invoice conversions.",
    stepByStep: ["Enter the base currency amount.","Select your source currency code (e.g. USD).","Select your target currency code (e.g. EUR).","Review the converted currency value."],
    advantages: ["Supports principal global currency pairs","Calculates instant conversions","Operates client-side securely"],
    commonMistakes: ["Expecting real-time offline conversions when exchange rates fluctuate"],
    faqs: [{"q":"Are rates updated in real-time?","a":"Yes, standard rates are updated periodically when online, and saved for offline fallback calculations."}]
  },
  "mortgage-calculator": {
    whyNeed: "Buying a home is a major decision; projecting monthly installments is key for budgets.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine computes monthly payments and creates amortization breakdowns client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Mortgage Calculator** when you need to estimate monthly mortgage installments including interest and taxes during estimating home buying costs, refinancing checks, and budget planning.",
    stepByStep: ["Enter the home value and down payment.","Type the annual interest rate.","Select the loan term (usually 15 or 30 years).","Review monthly payments and total interest costs."],
    advantages: ["Calculates property tax and home insurance splits","Shows complete loan amortization logs","Runs client-side securely"],
    commonMistakes: ["Ignoring local property tax and insurance fees that inflate monthly payments"],
    faqs: [{"q":"What is PMI?","a":"Private Mortgage Insurance is an extra monthly fee required if your down payment is less than 20% of the home value."}]
  },
  "loan-calculator": {
    whyNeed: "Comparing personal or commercial loan offers requires evaluating total interest costs.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies reducing interest rate loan formulas client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Loan Calculator** when you need to calculate general loan amortization variables during comparing loan offers, calculating personal loans, and debt audits.",
    stepByStep: ["Enter principal loan amount.","Type interest rate and tenure.","Review monthly installments, total interest, and grand payouts."],
    advantages: ["Calculates reducing-balance interest values","Generates detailed payment tables","Operates offline securely"],
    commonMistakes: ["Pasting flat interest rates when loan terms call for reducing balance rates"],
    faqs: [{"q":"What is the difference between flat and reducing rates?","a":"Flat rates charge interest on the entire original principal; reducing rates calculate interest on the remaining unpaid balance, saving you money."}]
  },
  "income-tax-calculator": {
    whyNeed: "Navigating changing tax slabs and regimes manually is highly confusing.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies tax slab structures and deductions to income models client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Income Tax Calculator** when you need to estimate tax liabilities under different regimes during planning annual tax deductions, comparing tax regimes, and estimating liabilities.",
    stepByStep: ["Enter your annual gross income.","Input tax deductions (like 80C, HRA, health premiums).","Compare estimated tax liabilities under the Old and New tax regimes."],
    advantages: ["Compares Old vs New tax slabs side-by-side","Supports multiple deduction fields","Runs 100% locally to protect private income data"],
    commonMistakes: ["Entering gross income without deducting tax-exempt components, which inflates tax estimates"],
    faqs: [{"q":"Does this save my income data?","a":"No. All calculation parameters run inside your browser and vanish when the tab is closed."}]
  },
  "gst-calculator": {
    whyNeed: "Auditing invoices and splitting net prices from gross sales numbers manually is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine calculates tax margins using percentage addition and subtraction formulas for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **GST Calculator** when you need to calculate Goods and Services Tax (GST) allocations during adding GST to product prices, extracting GST from gross invoices, and business accounting.",
    stepByStep: ["Enter the base product amount.","Select the GST rate percentage (e.g. 5%, 12%, 18%, 28%).","Click Add GST or Remove GST to see calculations."],
    advantages: ["Calculates both inclusive and exclusive GST values","Splits outputs into CGST and SGST logs","Runs client-side instantly"],
    commonMistakes: ["Dividing instead of multiplying percentages when trying to add GST to base amounts"],
    faqs: [{"q":"What is CGST and SGST?","a":"CGST goes to the central government, and SGST goes to the state government, usually splitting the total GST rate in half."}]
  },
  "discount-calculator": {
    whyNeed: "Working out exact markdown percentages and net prices during sales is annoying.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine computes percentage savings and net sale prices for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Discount Calculator** when you need to calculate savings and markdown sale prices during shopping price checks, retail pricing, and discount audits.",
    stepByStep: ["Enter original product price.","Input discount percentage percentage.","Check net sale price and total savings."],
    advantages: ["Supports multiple stackable discounts","Shows savings in currency values","Runs offline instantly"],
    commonMistakes: ["Adding percentages together incorrectly when stackable discounts are applied"],
    faqs: [{"q":"What is a stackable discount?","a":"It is a secondary discount applied to the already reduced price, not added directly to the first percentage."}]
  },
  "profit-calculator": {
    whyNeed: "Pricing products to hit specific margin targets manually is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies standard profit margin and markup business formulas for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Profit Calculator** when you need to calculate profit margins, markups, and costs during pricing retail goods, tracking wholesale costs, and margin planning.",
    stepByStep: ["Enter cost price.","Enter selling price or target margin percentage.","Review profit amount, margin percentage, and markup percentage."],
    advantages: ["Calculates both gross margin and markup percentages","Helps set retail pricing structures","Runs client-side securely"],
    commonMistakes: ["Confusing profit margin (calculated on selling price) with markup (calculated on cost price)"],
    faqs: [{"q":"What is the difference between margin and markup?","a":"Margin is profit divided by selling price; markup is profit divided by cost price."}]
  },
  "youtube-earnings-calculator": {
    whyNeed: "Estimating revenue shares from ad views with changing CPM values is confusing.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine projects earnings based on views, CTR, and CPM variables for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **YouTube Earnings Calculator** when you need to estimate YouTube monetization earnings during content creator planning, channel valuation, and revenue estimations.",
    stepByStep: ["Enter expected daily or monthly video views.","Set estimated RPM/CPM dollar range using the slider.","Review estimated daily, monthly, and yearly creator earnings."],
    advantages: ["Simulates varying CPM thresholds","Calculates daily, monthly, and yearly estimates","Runs client-side securely"],
    commonMistakes: ["Assuming CPM rates are constant across all regions and topics"],
    faqs: [{"q":"What is RPM?","a":"Revenue Per Mille represents the actual earnings a creator receives per 1,000 views after YouTube's fee cut."}]
  },
  "adsense-revenue-calculator": {
    whyNeed: "Checking website traffic earning potential across different CTR and CPC settings is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine projects revenue based on impressions, CTR, and CPC metrics for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **AdSense Revenue Calculator** when you need to estimate website Google AdSense earnings during blog traffic planning, website valuations, and marketing projections.",
    stepByStep: ["Enter page impressions.","Input CTR percentage and CPC click value.","Check daily, monthly, and yearly projected revenues."],
    advantages: ["Calculates CPC and CTR revenue splits","Helps plan traffic targets for blogs","Runs locally in browser RAM"],
    commonMistakes: ["Using unrealistic CTR percentages; average website CTR is around 1% to 2%"],
    faqs: [{"q":"What is CPC?","a":"Cost Per Click is the amount an advertiser pays each time a user clicks on an ad."}]
  },
  "simple-interest-calculator": {
    whyNeed: "Working out flat interest rates for bonds or personal loans requires a quick calculator.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies the mathematical formula `Interest = P * R * T` for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Simple Interest Calculator** when you need to calculate simple interest yields during checking flat interest returns, evaluating simple loans, and homework checks.",
    stepByStep: ["Enter principal sum.","Type annual interest rate.","Set duration in years or months.","Check total interest and final maturity value."],
    advantages: ["Simple, flat interest rate calculations","Processes values in milliseconds","Runs locally in browser memory"],
    commonMistakes: ["Using simple interest formulas for accounts that compound interest (like FDs)"],
    faqs: [{"q":"How is simple interest different from compound interest?","a":"Simple interest is only calculated on the original principal; compound interest earns interest on previous interest as well."}]
  },
  "salary-calculator": {
    whyNeed: "Comparing hourly job offers with annual salaries requires converting salary intervals.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine calculates salary values using standard hourly and weekly calendar work factors client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Salary Calculator** when you need to convert wages across hourly, daily, weekly, monthly, and annual salaries during comparing job offers, calculating contractor wages, and budget planning.",
    stepByStep: ["Enter wage amount.","Select source interval (hourly, weekly, monthly, annually).","Input work hours per week.","Review the wage conversion table across all intervals."],
    advantages: ["Converts salaries across 5 common intervals simultaneously","Adjustable work hours and vacation assumptions","Runs client-side securely"],
    commonMistakes: ["Forgetting that tax withholdings will reduce net take-home pay compared to these gross values"],
    faqs: [{"q":"How many working weeks are assumed in a year?","a":"Standard calculations assume 52 working weeks per year."}]
  },
  "percentage-calculator": {
    whyNeed: "Working out percentage increases, fractional portions, or differences manually is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies percentage formulas client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Percentage Calculator** when you need to evaluate percentage differences, growth rates, and margins during calculating grade improvements, retail margins, and data changes.",
    stepByStep: ["Select the percentage equation type (e.g. What is X% of Y?).","Input numeric values.","Review the calculated percentage output."],
    advantages: ["Supports multiple percentage equations","Handles decimal percentages accurately","Runs offline instantly"],
    commonMistakes: ["Confusing percentage points with percentage changes"],
    faqs: [{"q":"How is percentage difference calculated?","a":"It divides the absolute difference by the average of the two numbers, multiplied by 100."}]
  },
  "cgpa-calculator": {
    whyNeed: "Averaging grades across different subject credits manually is slow and leads to errors.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine calculates weighted GPA averages based on grades and credits for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **CGPA Calculator** when you need to compute Cumulative Grade Point Averages (CGPA) and convert to percentages during academic grade audits, university applications, and GPA conversions.",
    stepByStep: ["Add your course semesters or subjects.","Enter grades and credits for each course.","Check your cumulative CGPA and percentage conversion."],
    advantages: ["Allows adding multiple courses with credits","Converts CGPA to percentage standards","Runs client-side securely"],
    commonMistakes: ["Entering grades without credit weightings, which biases final averages"],
    faqs: [{"q":"What is the standard CGPA to percentage conversion?","a":"Many boards (like CBSE) multiply CGPA by 9.5 to estimate the percentage."}]
  },
  "scientific-calculator": {
    whyNeed: "Standard calculators lack trigonometric, exponential, and logarithmic functions required for engineering and science.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine runs advanced scientific math modules inside browser memory for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Scientific Calculator** when you need to solve complex trigonometry, algebraic equations, and logarithms during solving engineering problems, math homework, and physics calculations.",
    stepByStep: ["Type mathematical expressions using functions (sin, cos, log, ln, sqrt).","Review output results updated on screen.","Toggle between degrees and radians."],
    advantages: ["Supports trigonometry, exponents, logarithms, and roots","Maintains history logs of calculations","Runs client-side in secure sandbox"],
    commonMistakes: ["Entering invalid mathematical syntax causing parse errors"],
    faqs: [{"q":"Does it support degrees and radians?","a":"Yes, you can toggle between DEG and RAD modes for trigonometric functions."}]
  },
  "basic-calculator": {
    whyNeed: "Quick arithmetic checks shouldn't require opening heavy program sheets.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine processes basic math queries (+, -, *, /) client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Basic Calculator** when you need to run fundamental arithmetic equations during daily budget checks, homework audits, and quick receipts addition.",
    stepByStep: ["Click buttons or type numbers and operators.","Review calculation total."],
    advantages: ["Responsive layout works on mobile and desktop","Instant, zero-latency calculation","Runs offline securely"],
    commonMistakes: ["Dividing by zero, which results in 'Infinity' errors"],
    faqs: [{"q":"Does it support keyboard shortcuts?","a":"Yes, you can use standard keyboard number pad keys to input calculations."}]
  },
  "age-calculator": {
    whyNeed: "Figuring out exact age in months, weeks, and days, or calculating next birthday countdowns manually is tricky.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine computes date intervals factoring in leap years and months client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Age Calculator** when you need to calculate exact chronological age during verifying age limits for registration forms, checking child milestones, and birthday countdowns.",
    stepByStep: ["Select your date of birth.","Select target calculation date (defaults to current date).","Review age in years, months, weeks, days, and seconds."],
    advantages: ["Calculates age down to the exact day and second","Displays next birthday countdown timer","Runs locally in browser RAM"],
    commonMistakes: ["Entering incorrect target dates that precede your birthdate"],
    faqs: [{"q":"Does the calculator account for leap years?","a":"Yes, the calculations factor in leap years and the varying number of days in each month."}]
  },
  "date-difference-calculator": {
    whyNeed: "Determining exact project timelines or calendar gaps manually is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine computes days, weeks, and months between calendar dates client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Date Difference Calculator** when you need to calculate duration between two dates during planning project deadlines, checking billing intervals, and holiday planning.",
    stepByStep: ["Select starting date.","Select end date.","Review elapsed time in years, months, and days."],
    advantages: ["Calculates difference in multiple units (days, weeks, months)","Supports flexible calendar navigation","Runs offline securely"],
    commonMistakes: ["Forgetting to account for time zones when checking exact time differences"],
    faqs: [{"q":"Does it include the start date in the count?","a":"You can toggle options to include or exclude the start/end days."}]
  },
  "bmi-calculator": {
    whyNeed: "Checking weight status ranges manually requires looking up tables and calculating weight ratios.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies standard metric and imperial BMI formulas for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **BMI Calculator** when you need to estimate Body Mass Index (BMI) and health weight ranges during tracking fitness goals, healthy weight assessments, and personal health metrics.",
    stepByStep: ["Select your system (metric or imperial).","Enter height and weight.","Check your BMI score and weight category (underweight, normal, overweight)."],
    advantages: ["Displays standard BMI categories and ideal weight ranges","Supports both metric and imperial units","Runs client-side privately"],
    commonMistakes: ["Using BMI as a sole measure of health, as it doesn't account for muscle mass vs fat"],
    faqs: [{"q":"Is BMI accurate for athletes?","a":"BMI may overestimate body fat in muscular athletes because muscle weighs more than fat."}]
  },
  "calorie-calculator": {
    whyNeed: "Estimating daily calorie targets for weight loss or gain manually is complex.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies the Mifflin-St Jeor or Harris-Benedict formulas client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Calorie Calculator** when you need to calculate daily calorie targets and BMR during meal planning, tracking diet goals, and fitness planning.",
    stepByStep: ["Enter height, weight, age, and gender.","Select activity level.","Review your BMR and daily calorie goals."],
    advantages: ["Uses modern Mifflin-St Jeor equations","Provides calorie targets for weight loss, maintenance, and gain","Runs locally in browser RAM"],
    commonMistakes: ["Overestimating daily activity levels, which inflates calorie targets"],
    faqs: [{"q":"What is BMR?","a":"Basal Metabolic Rate is the number of calories your body burns at rest to maintain vital functions."}]
  },
  "tip-calculator": {
    whyNeed: "Splitting bills and tip percentages at restaurants verbally leads to math errors.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine divides total bills and tips across groups for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Tip Calculator** when you need to calculate tip percentages and split bills during restaurant bill splitting, group dining, and payment sharing.",
    stepByStep: ["Enter total bill amount.","Select tip percentage.","Input number of people sharing.","Review tip amount, total bill, and share per person."],
    advantages: ["Splits bills and tips evenly across custom group sizes","Handles fractional currency decimals","Runs client-side instantly"],
    commonMistakes: ["Double tipping when service tax is already included in the bill"],
    faqs: [{"q":"Can it handle tax addition?","a":"You can enter the bill amount inclusive of tax to get the final split details."}]
  },
  "time-duration-calculator": {
    whyNeed: "Adding and subtracting time values manually is confusing due to base-60 hours and minutes.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine calculates hours, minutes, and seconds difference between times for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Time Duration Calculator** when you need to calculate duration between two timestamps during calculating work hours, tracking task durations, and payroll auditing.",
    stepByStep: ["Select start time.","Select end time.","Review elapsed time in hours, minutes, and seconds."],
    advantages: ["Calculates time differences in base-60 format accurately","Supports both 12-hour and 24-hour time formats","Runs locally in browser RAM"],
    commonMistakes: ["Crossing midnight boundaries without checking date rollers"],
    faqs: [{"q":"Does it support crossing midnight?","a":"Yes, it calculates elapsed duration across midnight boundaries correctly."}]
  }
};
