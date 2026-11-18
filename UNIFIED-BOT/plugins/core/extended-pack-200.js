const fail = message => { throw new Error(message); };
const text = s => String(s ?? "");
const words = s => text(s).trim().split(/\s+/u).filter(Boolean);
const numbers = s => {
  const values = text(s).trim().split(/[\s,]+/).filter(Boolean).map(Number);
  if (!values.length || values.some(v => !Number.isFinite(v))) fail("Enter valid numbers separated by spaces or commas.");
  return values;
};
const pair = s => { const a = numbers(s); if (a.length !== 2) fail("Enter exactly two numbers."); return a; };
const isoDate = s => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text(s))) fail("Use a date in YYYY-MM-DD format.");
  const d = new Date(s + "T00:00:00Z");
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== s) fail("Invalid date.");
  return d;
};
const fmt = n => Number.isFinite(n) ? String(Number(n.toFixed(8))) : "Result is outside the supported range.";
const handlers = {};
const add = (category, entries) => {
  for (const [id, description, run] of entries) {
    if (handlers[id]) throw new Error("Duplicate extended command: " + id);
    handlers[id] = { category, description, run };
  }
};

// TEXT — 25
add("Text", [
["text_upper","Convert text to uppercase",s=>s.toLocaleUpperCase()],
["text_lower","Convert text to lowercase",s=>s.toLocaleLowerCase()],
["text_title","Convert text to title case",s=>s.toLocaleLowerCase().replace(/\b\p{L}/gu,c=>c.toLocaleUpperCase())],
["text_sentence","Convert text to sentence case",s=>s.toLocaleLowerCase().replace(/(^|[.!?]\s+)\p{L}/gu,c=>c.toLocaleUpperCase())],
["text_swapcase","Swap letter case",s=>[...s].map(c=>c===c.toLocaleUpperCase()?c.toLocaleLowerCase():c.toLocaleUpperCase()).join("")],
["text_reverse","Reverse all characters",s=>[...s].reverse().join("")],
["text_reversewords","Reverse word order",s=>words(s).reverse().join(" ")],
["text_trim","Trim leading and trailing whitespace",s=>s.trim()],
["text_collapse","Collapse repeated whitespace",s=>s.replace(/\s+/gu," ").trim()],
["text_nospaces","Remove all whitespace",s=>s.replace(/\s/gu,"")],
["text_newlines","Replace line breaks with spaces",s=>s.replace(/\r?\n/g," ")],
["text_lines","Number each non-empty line",s=>s.split(/\r?\n/).filter(Boolean).map((v,i)=>(i+1)+". "+v).join("\n")],
["text_sortlines","Sort lines alphabetically",s=>s.split(/\r?\n/).sort((a,b)=>a.localeCompare(b)).join("\n")],
["text_unique_lines","Remove duplicate lines",s=>[...new Set(s.split(/\r?\n/))].join("\n")],
["text_unique_words","Remove duplicate words",s=>[...new Set(words(s))].join(" ")],
["text_initials","Extract initials from words",s=>words(s).map(w=>w[0]).join("").toUpperCase()],
["text_slug","Create a URL-friendly slug",s=>s.normalize("NFKD").toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,"")],
["text_palindrome","Check whether text is a palindrome",s=>{const v=s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,"");return v && v===[...v].reverse().join("")?"Palindrome":"Not a palindrome";}],
["text_wordcount","Count words",s=>"Words: "+words(s).length],
["text_charcount","Count characters",s=>"Characters: "+[...s].length],
["text_linecount","Count lines",s=>"Lines: "+(s?s.split(/\r?\n/).length:0)],
["text_sentencecount","Count sentence endings",s=>"Sentences: "+(s.match(/[.!?]+(?=\s|$)/g)||[]).length],
["text_readtime","Estimate reading time at 200 words per minute",s=>"Estimated reading time: "+Math.max(1,Math.ceil(words(s).length/200))+" minute(s)"],
["text_longestword","Find the longest word",s=>words(s).sort((a,b)=>b.length-a.length)[0]||"No words found."],
["text_shortestword","Find the shortest word",s=>words(s).sort((a,b)=>a.length-b.length)[0]||"No words found."],
["text_frequency","Show the ten most frequent words",s=>{const m={};for(const w of words(s))m[w.toLowerCase()]=(m[w.toLowerCase()]||0)+1;return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([w,n])=>w+": "+n).join("\n")||"No words found.";}]
]);

// MATHEMATICS — 30
add("Math", [
["math_sum","Sum a list of numbers",s=>fmt(numbers(s).reduce((a,b)=>a+b,0))],
["math_product","Multiply a list of numbers",s=>fmt(numbers(s).reduce((a,b)=>a*b,1))],
["math_mean","Calculate arithmetic mean",s=>{const a=numbers(s);return fmt(a.reduce((x,y)=>x+y,0)/a.length);}],
["math_median","Calculate median",s=>{const a=numbers(s).sort((x,y)=>x-y),m=a.length>>1;return fmt(a.length%2?a[m]:(a[m-1]+a[m])/2);}],
["math_min","Find minimum value",s=>fmt(Math.min(...numbers(s)))],
["math_max","Find maximum value",s=>fmt(Math.max(...numbers(s)))],
["math_range","Calculate range",s=>{const a=numbers(s);return fmt(Math.max(...a)-Math.min(...a));}],
["math_variance","Calculate population variance",s=>{const a=numbers(s),m=a.reduce((x,y)=>x+y,0)/a.length;return fmt(a.reduce((z,x)=>z+(x-m)**2,0)/a.length);}],
["math_stddev","Calculate population standard deviation",s=>{const a=numbers(s),m=a.reduce((x,y)=>x+y,0)/a.length;return fmt(Math.sqrt(a.reduce((z,x)=>z+(x-m)**2,0)/a.length));}],
["math_percent","Calculate percentage: part total",s=>{const [a,b]=pair(s);if(!b)fail("Total cannot be zero.");return fmt(a/b*100)+"%";}],
["math_percentof","Calculate a percentage of a value: percent value",s=>{const [a,b]=pair(s);return fmt(a*b/100);}],
["math_change","Calculate percentage change: old new",s=>{const [a,b]=pair(s);if(!a)fail("Old value cannot be zero.");return fmt((b-a)/Math.abs(a)*100)+"%";}],
["math_abs","Absolute value",s=>fmt(Math.abs(Number(s)))],
["math_sqrt","Square root of a non-negative number",s=>{const n=Number(s);if(!Number.isFinite(n)||n<0)fail("Enter a non-negative number.");return fmt(Math.sqrt(n));}],
["math_square","Square a number",s=>fmt(Number(s)**2)],
["math_cube","Cube a number",s=>fmt(Number(s)**3)],
["math_power","Calculate power: base exponent",s=>{const [a,b]=pair(s);return fmt(a**b);}],
["math_root","Calculate nth root: value degree",s=>{const [a,n]=pair(s);if(!n||a<0&&n%2===0)fail("Invalid real root.");return fmt(Math.sign(a)*Math.abs(a)**(1/n));}],
["math_factorial","Calculate factorial for integers 0–170",s=>{const n=Number(s);if(!Number.isInteger(n)||n<0||n>170)fail("Enter an integer from 0 to 170.");let r=1;for(let i=2;i<=n;i++)r*=i;return String(r);}],
["math_gcd","Greatest common divisor of two integers",s=>{let [a,b]=pair(s).map(Math.abs);if(!Number.isInteger(a)||!Number.isInteger(b))fail("Use integers.");while(b)[a,b]=[b,a%b];return String(a);}],
["math_lcm","Least common multiple of two integers",s=>{let [a,b]=pair(s);if(!Number.isInteger(a)||!Number.isInteger(b))fail("Use integers.");let x=Math.abs(a),y=Math.abs(b);while(y)[x,y]=[y,x%y];return String(x?Math.abs(a*b)/x:0);}],
["math_prime","Check if an integer is prime",s=>{const n=Number(s);if(!Number.isInteger(n))fail("Enter an integer.");let p=n>1;for(let i=2;i*i<=n&&p;i++)if(n%i===0)p=false;return p?"Prime":"Not prime";}],
["math_factors","List positive factors of an integer",s=>{const n=Number(s);if(!Number.isInteger(n)||n<1||n>100000000)fail("Enter an integer from 1 to 100000000.");const a=[];for(let i=1;i<=Math.sqrt(n);i++)if(n%i===0){a.push(i);if(i!==n/i)a.push(n/i);}return a.sort((x,y)=>x-y).join(", ");}],
["math_fibonacci","Generate Fibonacci sequence: count (max 50)",s=>{const n=Number(s);if(!Number.isInteger(n)||n<1||n>50)fail("Enter a count from 1 to 50.");let a=0,b=1,r=[];for(let i=0;i<n;i++){r.push(a);[a,b]=[b,a+b];}return r.join(", ");}],
["math_round","Round a number: value decimal_places",s=>{const [n,d=0]=numbers(s);return Number(n).toFixed(Math.max(0,Math.min(10,Math.trunc(d))));}],
["math_clamp","Clamp value between minimum and maximum: value min max",s=>{const a=numbers(s);if(a.length!==3||a[1]>a[2])fail("Use value min max, with min ≤ max.");return String(Math.min(a[2],Math.max(a[1],a[0])));}],
["math_interpolate","Linear interpolation: start end fraction",s=>{const a=numbers(s);if(a.length!==3)fail("Use start end fraction.");return fmt(a[0]+(a[1]-a[0])*a[2]);}],
["math_midpoint","Midpoint of two values",s=>{const [a,b]=pair(s);return fmt((a+b)/2);}],
["math_slope","Slope from x1 y1 x2 y2",s=>{const a=numbers(s);if(a.length!==4||a[2]===a[0])fail("Use x1 y1 x2 y2 with different x values.");return fmt((a[3]-a[1])/(a[2]-a[0]));}]
]);

// DATE AND TIME — 20
add("Dates", [
["date_today","Current date in UTC",()=>new Date().toISOString().slice(0,10)],
["date_now","Current UTC date and time",()=>new Date().toISOString()],
["date_timestamp","Current Unix timestamp in seconds",()=>String(Math.floor(Date.now()/1000))],
["date_weekday","Weekday for YYYY-MM-DD",s=>new Intl.DateTimeFormat("en",{weekday:"long",timeZone:"UTC"}).format(isoDate(s))],
["date_dayyear","Day number within the year",s=>{const d=isoDate(s);return String(Math.floor((d-Date.UTC(d.getUTCFullYear(),0,1))/86400000)+1);}],
["date_weekend","Check whether a date falls on a weekend",s=>[0,6].includes(isoDate(s).getUTCDay())?"Weekend":"Weekday"],
["date_leap","Check whether a year is a leap year",s=>{const y=Number(s);if(!Number.isInteger(y)||y<1)fail("Enter a positive year.");return y%4===0&&(y%100!==0||y%400===0)?"Leap year":"Common year";}],
["date_monthdays","Number of days in a month: year month",s=>{const [y,m]=pair(s);if(!Number.isInteger(y)||!Number.isInteger(m)||m<1||m>12)fail("Use year and month 1–12.");return String(new Date(Date.UTC(y,m,0)).getUTCDate());}],
["date_adddays","Add days: YYYY-MM-DD days",s=>{const [d,n]=s.split(/\s+/);const x=isoDate(d),v=Number(n);if(!Number.isInteger(v))fail("Enter a whole number of days.");x.setUTCDate(x.getUTCDate()+v);return x.toISOString().slice(0,10);}],
["date_addweeks","Add weeks: YYYY-MM-DD weeks",s=>{const [d,n]=s.split(/\s+/);const x=isoDate(d),v=Number(n);if(!Number.isInteger(v))fail("Enter a whole number of weeks.");x.setUTCDate(x.getUTCDate()+7*v);return x.toISOString().slice(0,10);}],
["date_addmonths","Add months: YYYY-MM-DD months",s=>{const [d,n]=s.split(/\s+/);const x=isoDate(d),v=Number(n),day=x.getUTCDate();if(!Number.isInteger(v))fail("Enter a whole number of months.");x.setUTCDate(1);x.setUTCMonth(x.getUTCMonth()+v);x.setUTCDate(Math.min(day,new Date(Date.UTC(x.getUTCFullYear(),x.getUTCMonth()+1,0)).getUTCDate()));return x.toISOString().slice(0,10);}],
["date_diff","Difference in days: YYYY-MM-DD YYYY-MM-DD",s=>{const [a,b]=s.split(/\s+/);return Math.round(Math.abs(isoDate(b)-isoDate(a))/86400000)+" days";}],
["date_businessdays","Count weekdays inclusive: date1 | date2",s=>{const [a,b]=s.split("|").map(x=>x.trim());let d=isoDate(a),e=isoDate(b),n=0;if(e<d)[d,e]=[e,d];if((e-d)/86400000>36600)fail("Date range is too large.");while(d<=e){if(d.getUTCDay()>0&&d.getUTCDay()<6)n++;d.setUTCDate(d.getUTCDate()+1);}return n+" weekdays";}],
["date_quarter","Quarter for YYYY-MM-DD",s=>"Q"+(Math.floor(isoDate(s).getUTCMonth()/3)+1)],
["date_monthstart","First date of the month for YYYY-MM-DD",s=>{const d=isoDate(s);return d.toISOString().slice(0,8)+"01";}],
["date_monthend","Last date of the month for YYYY-MM-DD",s=>{const d=isoDate(s);return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).toISOString().slice(0,10);}],
["date_yearstart","First date of the year for YYYY-MM-DD",s=>isoDate(s).getUTCFullYear()+"-01-01"],
["date_yearend","Last date of the year for YYYY-MM-DD",s=>isoDate(s).getUTCFullYear()+"-12-31"],
["date_iso","Validate and normalize YYYY-MM-DD",s=>isoDate(s).toISOString().slice(0,10)],
["date_compare","Compare dates: YYYY-MM-DD YYYY-MM-DD",s=>{const [a,b]=s.split(/\s+/),x=isoDate(a),y=isoDate(b);return x<y?"First date is earlier":x>y?"First date is later":"Dates are equal";}]
]);

// CONVERTERS — 25
add("Converters", [
["conv_km_mi","Kilometres to miles",s=>fmt(Number(s)*0.621371)+" mi"],
["conv_mi_km","Miles to kilometres",s=>fmt(Number(s)*1.609344)+" km"],
["conv_m_cm","Metres to centimetres",s=>fmt(Number(s)*100)+" cm"],
["conv_cm_m","Centimetres to metres",s=>fmt(Number(s)/100)+" m"],
["conv_m_mm","Metres to millimetres",s=>fmt(Number(s)*1000)+" mm"],
["conv_mm_m","Millimetres to metres",s=>fmt(Number(s)/1000)+" m"],
["conv_m_ft","Metres to feet",s=>fmt(Number(s)*3.28084)+" ft"],
["conv_ft_m","Feet to metres",s=>fmt(Number(s)/3.28084)+" m"],
["conv_in_cm","Inches to centimetres",s=>fmt(Number(s)*2.54)+" cm"],
["conv_cm_in","Centimetres to inches",s=>fmt(Number(s)/2.54)+" in"],
["conv_kg_lb","Kilograms to pounds",s=>fmt(Number(s)*2.2046226218)+" lb"],
["conv_lb_kg","Pounds to kilograms",s=>fmt(Number(s)/2.2046226218)+" kg"],
["conv_g_oz","Grams to ounces",s=>fmt(Number(s)/28.349523125)+" oz"],
["conv_oz_g","Ounces to grams",s=>fmt(Number(s)*28.349523125)+" g"],
["conv_l_ml","Litres to millilitres",s=>fmt(Number(s)*1000)+" mL"],
["conv_ml_l","Millilitres to litres",s=>fmt(Number(s)/1000)+" L"],
["conv_l_gal","Litres to US gallons",s=>fmt(Number(s)/3.785411784)+" US gal"],
["conv_gal_l","US gallons to litres",s=>fmt(Number(s)*3.785411784)+" L"],
["conv_c_f","Celsius to Fahrenheit",s=>fmt(Number(s)*9/5+32)+" °F"],
["conv_f_c","Fahrenheit to Celsius",s=>fmt((Number(s)-32)*5/9)+" °C"],
["conv_k_c","Kelvin to Celsius",s=>{const n=Number(s);if(n<0)fail("Kelvin cannot be negative.");return fmt(n-273.15)+" °C";}],
["conv_c_k","Celsius to Kelvin",s=>{const n=Number(s);if(n< -273.15)fail("Temperature is below absolute zero.");return fmt(n+273.15)+" K";}],
["conv_mb_gb","Megabytes to gigabytes (1024-based)",s=>fmt(Number(s)/1024)+" GB"],
["conv_gb_mb","Gigabytes to megabytes (1024-based)",s=>fmt(Number(s)*1024)+" MB"],
["conv_bytes","Bytes to readable binary units",s=>{let n=Number(s);if(!Number.isFinite(n)||n<0)fail("Enter non-negative bytes.");const u=["B","KiB","MiB","GiB","TiB"];let i=0;while(n>=1024&&i<4){n/=1024;i++;}return n.toFixed(2)+" "+u[i];}]
]);

// SCIENCE AND GEOMETRY — 20
add("Science", [
["sci_speed","Speed from distance and time",s=>{const [d,t]=pair(s);if(t<=0)fail("Time must be positive.");return fmt(d/t)+" distance-units/time-unit";}],
["sci_distance","Distance from speed and time",s=>{const [v,t]=pair(s);return fmt(v*t)+" distance-units";}],
["sci_time","Time from distance and speed",s=>{const [d,v]=pair(s);if(v===0)fail("Speed cannot be zero.");return fmt(d/v)+" time-units";}],
["sci_force","Newton's second law: mass acceleration",s=>{const [m,a]=pair(s);return fmt(m*a)+" N";}],
["sci_density","Density: mass volume",s=>{const [m,v]=pair(s);if(v===0)fail("Volume cannot be zero.");return fmt(m/v)+" mass-units/volume-unit";}],
["sci_pressure","Pressure: force area",s=>{const [f,a]=pair(s);if(a===0)fail("Area cannot be zero.");return fmt(f/a)+" Pa";}],
["sci_work","Work: force distance",s=>{const [f,d]=pair(s);return fmt(f*d)+" J";}],
["sci_power","Power: work time",s=>{const [w,t]=pair(s);if(t===0)fail("Time cannot be zero.");return fmt(w/t)+" W";}],
["sci_kinetic","Kinetic energy: mass velocity",s=>{const [m,v]=pair(s);return fmt(.5*m*v*v)+" J";}],
["sci_potential","Gravitational potential energy: mass height (g=9.81)",s=>{const [m,h]=pair(s);return fmt(m*9.81*h)+" J";}],
["sci_ohm_v","Ohm's law voltage: current resistance",s=>{const [i,r]=pair(s);return fmt(i*r)+" V";}],
["sci_ohm_i","Ohm's law current: voltage resistance",s=>{const [v,r]=pair(s);if(r===0)fail("Resistance cannot be zero.");return fmt(v/r)+" A";}],
["sci_ohm_r","Ohm's law resistance: voltage current",s=>{const [v,i]=pair(s);if(i===0)fail("Current cannot be zero.");return fmt(v/i)+" Ω";}],
["geo_circlearea","Circle area from radius",s=>{const r=Number(s);if(r<0)fail("Radius cannot be negative.");return fmt(Math.PI*r*r)+" square units";}],
["geo_circumference","Circle circumference from radius",s=>{const r=Number(s);if(r<0)fail("Radius cannot be negative.");return fmt(2*Math.PI*r)+" units";}],
["geo_trianglearea","Triangle area: base height",s=>{const [b,h]=pair(s);return fmt(b*h/2)+" square units";}],
["geo_rectangle","Rectangle area: length width",s=>{const [a,b]=pair(s);return fmt(a*b)+" square units";}],
["geo_trapezoid","Trapezoid area: parallel sides height",s=>{const a=numbers(s);if(a.length!==3)fail("Use side1 side2 height.");return fmt((a[0]+a[1])*a[2]/2)+" square units";}],
["geo_spherevolume","Sphere volume from radius",s=>{const r=Number(s);if(r<0)fail("Radius cannot be negative.");return fmt(4*Math.PI*r**3/3)+" cubic units";}],
["geo_cylindervolume","Cylinder volume: radius height",s=>{const [r,h]=pair(s);if(r<0)fail("Radius cannot be negative.");return fmt(Math.PI*r*r*h)+" cubic units";}]
]);

// DEVELOPER AND DATA HELPERS — 20
add("Developer", [
["dev_jsonformat","Pretty-print JSON",s=>JSON.stringify(JSON.parse(s),null,2)],
["dev_jsonminify","Minify valid JSON",s=>JSON.stringify(JSON.parse(s))],
["dev_jsonkeys","List top-level JSON object keys",s=>{const x=JSON.parse(s);if(!x||typeof x!=="object"||Array.isArray(x))fail("Provide a JSON object.");return Object.keys(x).join("\n")||"No keys."; }],
["dev_jsonvalues","List top-level JSON values",s=>{const x=JSON.parse(s);if(!x||typeof x!=="object"||Array.isArray(x))fail("Provide a JSON object.");return Object.values(x).map(v=>JSON.stringify(v)).join("\n")||"No values."; }],
["dev_jsonvalidate","Validate JSON syntax",s=>{JSON.parse(s);return "Valid JSON ✓";}],
["dev_base64encode","Encode text as Base64",s=>Buffer.from(s,"utf8").toString("base64")],
["dev_base64decode","Decode Base64 text",s=>{if(!/^[A-Za-z0-9+/]*={0,2}$/.test(s.trim()))fail("Invalid Base64 input.");return Buffer.from(s.trim(),"base64").toString("utf8");}],
["dev_urlencode","URL-encode text",s=>encodeURIComponent(s)],
["dev_urldecode","Decode URL-encoded text",s=>decodeURIComponent(s)],
["dev_htmlencode","Escape HTML special characters",s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")],
["dev_htmldecode","Decode common HTML entities",s=>s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&")],
["dev_hexencode","Encode UTF-8 text as hexadecimal",s=>Buffer.from(s).toString("hex")],
["dev_hexdecode","Decode even-length hexadecimal text",s=>{if(!/^(?:[0-9a-f]{2})*$/i.test(s.trim()))fail("Use an even-length hexadecimal string.");return Buffer.from(s.trim(),"hex").toString("utf8");}],
["dev_binaryencode","Encode text as 8-bit binary groups",s=>[...Buffer.from(s)].map(v=>v.toString(2).padStart(8,"0")).join(" ")],
["dev_binarydecode","Decode 8-bit binary groups",s=>{const a=s.trim().split(/\s+/);if(!s.trim()||a.some(v=>!/^[01]{8}$/.test(v)))fail("Use 8-bit binary groups separated by spaces.");return Buffer.from(a.map(v=>parseInt(v,2))).toString("utf8");}],
["dev_sha256","Create SHA-256 digest",s=>cryptoHash("sha256",s)],
["dev_sha512","Create SHA-512 digest",s=>cryptoHash("sha512",s)],
["dev_md5","Create MD5 checksum (not for security)",s=>cryptoHash("md5",s)],
["dev_uuid","Generate a random UUID",()=>globalThis.crypto?.randomUUID?.()||"UUID generation unavailable."],
["dev_colorhex","Validate a 3- or 6-digit hex color",s=>/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.trim())?"Valid hex color":"Invalid hex color"]
]);

// STUDY AND PRODUCTIVITY — 20
add("Study", [
["study_checklist","Turn lines into unchecked checklist items",s=>s.split(/\r?\n/).filter(Boolean).map(x=>"☐ "+x).join("\n")],
["study_done","Turn lines into completed checklist items",s=>s.split(/\r?\n/).filter(Boolean).map(x=>"☑ "+x).join("\n")],
["study_flashcard","Format a flashcard: question | answer",s=>{const [q,a]=s.split("|");if(!q||!a)fail("Use question | answer.");return "QUESTION: "+q.trim()+"\nANSWER: "+a.trim();}],
["study_quizpercent","Calculate quiz percentage: correct total",s=>{const [a,b]=pair(s);if(b<=0||a<0||a>b)fail("Use correct answers and a positive total.");return fmt(a/b*100)+"%";}],
["study_grade","Calculate weighted score: score weight_percent",s=>{const [a,b]=pair(s);return fmt(a*b/100);}],
["study_gpaaverage","Average a list of grade values",s=>{const a=numbers(s);return fmt(a.reduce((x,y)=>x+y,0)/a.length);}],
["study_revision","Create a short revision sequence",s=>"REVISION PLAN — "+s+"\n1. Review key concepts\n2. Practise examples\n3. Attempt questions\n4. Check mistakes\n5. Summarise what to revisit"],
["study_pomodoro","Show a simple focus-and-break cycle",s=>"FOCUS PLAN"+(s?" — "+s:"")+"\n25 minutes focused work\n5-minute break\nRepeat up to four rounds, then take a longer break."],
["study_outline","Create a numbered outline from lines",s=>s.split(/\r?\n/).filter(Boolean).map((x,i)=>(i+1)+". "+x).join("\n")],
["study_mindmap","Format a simple text mind map",s=>{const a=s.split(/\r?\n/);return (a[0]||"MAIN IDEA")+"\n"+a.slice(1).map(x=>" ├─ "+x).join("\n");}],
["study_notes","Format notes with bullet points",s=>s.split(/\r?\n/).filter(Boolean).map(x=>"• "+x).join("\n")],
["study_definition","Format term and definition: term | definition",s=>{const [a,b]=s.split("|");if(!a||!b)fail("Use term | definition.");return "📘 "+a.trim()+"\n"+b.trim();}],
["study_citation","Format a basic web citation: title | https://url | access date",s=>{const [a,b,c]=s.split("|");if(!a||!/^https:\/\//i.test((b||"").trim()))fail("Use title | https://url | access date.");return a.trim()+". "+b.trim()+(c?" (Accessed "+c.trim()+")":"");}],
["study_readinglist","Format a reading list",s=>s.split(/\r?\n/).filter(Boolean).map((x,i)=>(i+1)+". "+x).join("\n")],
["study_examtopics","Create a topic tracker",s=>s.split(/\r?\n/).filter(Boolean).map(x=>"Topic: "+x+" | Status: Not started").join("\n")],
["study_smartgoal","Format a SMART goal",s=>"SMART GOAL — "+s+"\nSpecific:\nMeasurable:\nAchievable:\nRelevant:\nTime-bound:"],
["study_proscons","Create a pros-and-cons template",s=>"DECISION — "+s+"\nPROS\n• \nCONS\n• "],
["study_swot","Create a SWOT template",s=>"SWOT — "+s+"\nStrengths:\nWeaknesses:\nOpportunities:\nThreats:"],
["study_timeline","Turn lines into timeline points",s=>s.split(/\r?\n/).filter(Boolean).map((x,i)=>"• "+(i+1)+". "+x).join("\n")],
["study_agenda","Format a meeting or study agenda",s=>"AGENDA\n"+s.split(/\r?\n/).filter(Boolean).map((x,i)=>(i+1)+". "+x).join("\n")]
]);

// ORGANIZATION AND SOCIAL FORMATTING — 20
add("Productivity", [
["prod_taskbreakdown","Create task breakdown",s=>"TASK — "+s+"\n1. Define the outcome\n2. List required steps\n3. Gather resources\n4. Set a deadline\n5. Review completion"],
["prod_priority","Format a four-quadrant priority list",s=>{const a=s.split(/\r?\n/);return "DO FIRST: "+(a[0]||"—")+"\nSCHEDULE: "+(a[1]||"—")+"\nDELEGATE/ASK: "+(a[2]||"—")+"\nLATER: "+a.slice(3).join(", ");}],
["prod_meeting","Create meeting notes template",s=>"MEETING — "+s+"\nDate:\nAttendees:\nDiscussion:\nDecisions:\nAction items:\nNext meeting:"],
["prod_dailyplan","Create a daily plan",s=>"DAILY PLAN\n"+s.split(/\r?\n/).filter(Boolean).map((x,i)=>(i+1)+". "+x).join("\n")+"\n\nTop priority:"],
["prod_weekplan","Create a weekly plan",s=>"WEEKLY PLAN — "+s+"\nMonday:\nTuesday:\nWednesday:\nThursday:\nFriday:\nWeekend:"],
["prod_habittracker","Create habit tracker rows",s=>s.split(/\r?\n/).filter(Boolean).map(x=>x+" | Mon ☐ Tue ☐ Wed ☐ Thu ☐ Fri ☐ Sat ☐ Sun ☐").join("\n")],
["prod_deadline","Format a deadline reminder",s=>"⏰ DEADLINE\n"+s+"\nDue date:\nNext action:"],
["prod_event","Format event details",s=>"📅 EVENT\n"+s+"\nDate:\nTime:\nLocation:\nContact:"],
["prod_project","Create a project brief",s=>"PROJECT — "+s+"\nGoal:\nDeliverables:\nOwner:\nMilestones:\nRisks:\nNext step:"],
["prod_decision","Create a decision record",s=>"DECISION RECORD\nTopic: "+s+"\nOptions considered:\nChosen option:\nReason:\nReview date:"],
["prod_status","Format a progress update",s=>"STATUS UPDATE\nCompleted:\n"+s+"\nIn progress:\nBlocked by:\nNext:"],
["prod_feedback","Create a feedback request",s=>"FEEDBACK REQUEST\n"+s+"\nWhat worked well?\nWhat could improve?\nAny other notes?"],
["prod_thanks","Create a short thank-you note",s=>"Thank you"+(s?" for "+s:"")+"! Your time and support are appreciated."],
["prod_welcome","Create a welcome message",s=>"Welcome "+s+"! We're glad to have you here. Please take a moment to review the group guidelines."],
["prod_announcement","Format an announcement",s=>"📢 ANNOUNCEMENT\n"+s+"\n\nMore details: "],
["prod_poll","Format a poll: question | option | option",s=>{const a=s.split("|").map(x=>x.trim());if(a.length<3)fail("Use question | option 1 | option 2.");return "📊 "+a[0]+"\n"+a.slice(1).map((x,i)=>(i+1)+". "+x).join("\n");}],
["prod_faq","Format FAQ pairs: question | answer | question | answer",s=>{const a=s.split("|").map(x=>x.trim());if(a.length<2||a.length%2)fail("Provide question and answer pairs separated by |.");return a.reduce((o,x,i)=>o+(i%2?"A: "+x+"\n":"\nQ: "+x+"\n"),"FAQ");}],
["prod_bio","Format a short bio from phrases separated by |",s=>s.split("|").map(x=>x.trim()).filter(Boolean).join(" • ").slice(0,500)],
["prod_caption","Create a caption with a compact hashtag",s=>s+"\n#"+s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"").slice(0,24)],
["prod_group_rules","Create a group-guidelines template",s=>"GROUP GUIDELINES"+(s?" — "+s:"")+"\n1. Be respectful.\n2. Stay on topic.\n3. Avoid repeated messages.\n4. Do not share private information.\n5. Follow group admins' reasonable instructions."]
]);

// GENERAL DATA VALIDATION AND FORMATTING — 20
add("Data", [
["data_emailcheck","Check basic email syntax",s=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())?"Email syntax looks valid":"Invalid email syntax"],
["data_ipv4check","Validate IPv4 address syntax",s=>{const a=s.trim().split(".");return a.length===4&&a.every(v=>/^\d{1,3}$/.test(v)&&Number(v)<=255)?"Valid IPv4 address":"Invalid IPv4 address";}],
["data_uuidcheck","Validate UUID syntax",s=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s.trim())?"Valid UUID":"Invalid UUID"],
["data_phonecheck","Check a phone number's basic digit format",s=>/^\+?[0-9][0-9\s().-]{5,18}$/.test(s.trim())?"Plausible phone-number format":"Invalid phone-number format"],
["data_hexcheck","Validate hexadecimal characters",s=>/^(?:0x)?[0-9a-f]+$/i.test(s.trim())?"Valid hexadecimal characters":"Invalid hexadecimal input"],
["data_binarycheck","Validate a binary string",s=>/^[01]+$/.test(s.trim())?"Valid binary string":"Invalid binary string"],
["data_octalcheck","Validate an octal string",s=>/^[0-7]+$/.test(s.trim())?"Valid octal string":"Invalid octal string"],
["data_digits","Extract digits from text",s=>(s.match(/\d/g)||[]).join("")],
["data_emails","Extract email addresses from text",s=>(s.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)||[]).join("\n")||"No email addresses found."],
["data_urls","Extract HTTP/HTTPS links from text",s=>(s.match(/https?:\/\/[^\s<>"']+/gi)||[]).join("\n")||"No links found."],
["data_hashtags","Extract hashtags",s=>(s.match(/#[\p{L}\p{N}_]+/gu)||[]).join("\n")||"No hashtags found."],
["data_mentions","Extract @mentions",s=>(s.match(/@[\p{L}\p{N}_.-]+/gu)||[]).join("\n")||"No mentions found."],
["data_maskemail","Mask the local part of email addresses",s=>s.replace(/[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})/gi,(m,d)=>m[0]+"***@"+d)],
["data_maskphone","Partially mask phone-like number sequences",s=>s.replace(/\+?\d[\d\s().-]{6,}\d/g,m=>m.slice(0,3)+"••••"+m.slice(-2))],
["data_rgbhex","Convert RGB triplet to hex: red green blue",s=>{const a=numbers(s);if(a.length!==3||a.some(v=>!Number.isInteger(v)||v<0||v>255))fail("Use three integer RGB values from 0 to 255.");return "#"+a.map(v=>v.toString(16).padStart(2,"0")).join("").toUpperCase();}],
["data_hexrgb","Convert #RGB or #RRGGBB to RGB",s=>{let v=s.trim().replace(/^#/,"");if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(v))fail("Use #RGB or #RRGGBB.");if(v.length===3)v=[...v].map(c=>c+c).join("");return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16)).join(", ");}],
["data_csvcount","Count CSV rows and maximum columns",s=>{const rows=s.split(/\r?\n/).filter(Boolean);return "Rows: "+rows.length+"\nColumns (rough count): "+Math.max(0,...rows.map(r=>r.split(",").length));}],
["data_jsonarray","Check whether JSON is an array",s=>Array.isArray(JSON.parse(s))?"JSON array":"Valid JSON, but not an array"],
["data_jsonobject","Check whether JSON is an object",s=>{const v=JSON.parse(s);return v&&typeof v==="object"&&!Array.isArray(v)?"JSON object":"Valid JSON, but not an object";}],
["data_sortnumbers","Sort numbers ascending",s=>numbers(s).sort((a,b)=>a-b).join(", ")]
]);

// NUMERIC AND FORMAT HELPERS — 20
add("Utilities", [
["util_unique_numbers","Remove duplicate numbers",s=>[...new Set(numbers(s))].join(", ")],
["util_sort_desc","Sort numbers descending",s=>numbers(s).sort((a,b)=>b-a).join(", ")],
["util_numberstats","Show count, sum, mean, min and max",s=>{const a=numbers(s),sum=a.reduce((x,y)=>x+y,0);return "Count: "+a.length+"\nSum: "+fmt(sum)+"\nMean: "+fmt(sum/a.length)+"\nMin: "+Math.min(...a)+"\nMax: "+Math.max(...a);}],
["util_decimal_binary","Convert non-negative integer to binary",s=>{const n=Number(s);if(!Number.isSafeInteger(n)||n<0)fail("Enter a non-negative safe integer.");return n.toString(2);}],
["util_binary_decimal","Convert binary to decimal",s=>{if(!/^[01]+$/.test(s.trim()))fail("Enter a binary number.");return String(parseInt(s,2));}],
["util_decimal_hex","Convert non-negative integer to hexadecimal",s=>{const n=Number(s);if(!Number.isSafeInteger(n)||n<0)fail("Enter a non-negative safe integer.");return n.toString(16).toUpperCase();}],
["util_hex_decimal","Convert hexadecimal to decimal",s=>{if(!/^(?:0x)?[0-9a-f]+$/i.test(s.trim()))fail("Enter a hexadecimal number.");return String(parseInt(s.replace(/^0x/i,""),16));}],
["util_decimal_octal","Convert non-negative integer to octal",s=>{const n=Number(s);if(!Number.isSafeInteger(n)||n<0)fail("Enter a non-negative safe integer.");return n.toString(8);}],
["util_octal_decimal","Convert octal to decimal",s=>{if(!/^[0-7]+$/.test(s.trim()))fail("Enter an octal number.");return String(parseInt(s,8));}],
["util_scientific","Format number in scientific notation",s=>{const n=Number(s);if(!Number.isFinite(n))fail("Enter a valid number.");return n.toExponential(6);}],
["util_fraction_decimal","Convert fraction to decimal: numerator denominator",s=>{const [a,b]=pair(s);if(!b)fail("Denominator cannot be zero.");return fmt(a/b);}],
["util_decimal_fraction","Convert decimal to a fraction (up to 6 decimal places)",s=>{const n=Number(s);if(!Number.isFinite(n)||Math.abs(n)>1e9)fail("Enter a finite number with magnitude ≤ 1 billion.");const d=10**Math.min(6,(String(Math.abs(n)).split(".")[1]||"").length);let a=Math.round(n*d),b=d,x=Math.abs(a),y=b;while(y)[x,y]=[y,x%y];return (a/x)+"/"+(b/x);}],
["util_ratio","Simplify ratio: a b",s=>{let [a,b]=pair(s);if(!Number.isInteger(a)||!Number.isInteger(b))fail("Use integers.");let x=Math.abs(a),y=Math.abs(b);while(y)[x,y]=[y,x%y];return (a/(x||1))+":"+(b/(x||1));}],
["util_simple_interest","Simple interest: principal rate_percent years",s=>{const a=numbers(s);if(a.length!==3)fail("Use principal rate years.");const i=a[0]*a[1]*a[2]/100;return "Interest: "+fmt(i)+"\nTotal: "+fmt(a[0]+i);}],
["util_compound_interest","Compound amount: principal rate_percent compounds_per_year years",s=>{const a=numbers(s);if(a.length!==4||a[2]<=0)fail("Use principal rate compounds_per_year years.");const total=a[0]*(1+a[1]/(100*a[2]))**(a[2]*a[3]);return "Final amount: "+fmt(total)+"\nInterest: "+fmt(total-a[0]);}],
["util_average_speed","Average speed: total_distance total_time",s=>{const [d,t]=pair(s);if(t<=0)fail("Time must be positive.");return fmt(d/t);}],
["util_tip","Tip and total: bill tip_percent",s=>{const [b,p]=pair(s);if(b<0||p<0)fail("Values cannot be negative.");return "Tip: "+fmt(b*p/100)+"\nTotal: "+fmt(b*(1+p/100));}],
["util_discount","Discounted price: original_price discount_percent",s=>{const [p,d]=pair(s);if(p<0||d<0||d>100)fail("Use a non-negative price and discount from 0 to 100.");return "Savings: "+fmt(p*d/100)+"\nFinal price: "+fmt(p*(1-d/100));}],
["util_tax","Add tax: price tax_percent",s=>{const [p,t]=pair(s);if(p<0||t<0)fail("Values cannot be negative.");return "Tax: "+fmt(p*t/100)+"\nTotal: "+fmt(p*(1+t/100));}]
]);

function cryptoHash(algorithm, value) {
  // Node's built-in crypto keeps hashing local; no text is sent to a service.
  return createHash(algorithm, value);
}
function createHash(algorithm, value) {
  // Dynamic import is avoided: this module uses Node's built-in createHash.
  return hashSync(algorithm, value);
}
import { createHash as hashSync } from "node:crypto";

if (Object.keys(handlers).length !== 200) throw new Error("Expected exactly 200 new commands, got " + Object.keys(handlers).length);

export default Object.entries(handlers).map(([id, item]) => ({
  id,
  command: id,
  category: item.category,
  description: item.description,
  async execute({ args, reply }) {
    try {
      const input = (args || []).join(" ");
      const result = await item.run(input, args || []);
      await reply(String(result ?? "").slice(0, 3500) || "No result.");
    } catch (error) {
      await reply("⚠️ " + (error?.message || "Invalid input."));
    }
  }
}));
