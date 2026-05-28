import React, { useState } from 'react';
import axios from 'axios';
import { HeartPulse, CheckCircle2, FlaskConical, Activity, Heart, ArrowRight } from 'lucide-react';

const initialFormData = {
  Age: '',
  Sex: '',
  'Chest pain type': '',
  BP: '',
  Cholesterol: '',
  'FBS over 120': '',
  'EKG results': '',
  'Max HR': '',
  'Exercise angina': '',
  'ST depression': '',
  'Slope of ST': '',
  'Number of vessels fluro': '',
  Thallium: '',
};

// Map input names to user-friendly titles for the live summary
const fieldTitleMap = {
  Age: 'Age',
  Sex: 'Sex',
  'Chest pain type': 'Chest Pain',
  BP: 'BP',
  Cholesterol: 'Cholesterol',
  'FBS over 120': 'FBS > 120',
  'EKG results': 'EKG Status',
  'Max HR': 'Max HR',
  'Exercise angina': 'Ex. Angina',
  'ST depression': 'ST Depress.',
  'Slope of ST': 'ST Slope',
  'Number of vessels fluro': 'Fluro Vessels',
  Thallium: 'Thallium',
};

function HeartRiskPredictor() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === '' ? '' : value])
      );

      const response = await axios.post('http://127.0.0.1:5000/predict_heart_disease', payload);
      setResult(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      const message = err?.response?.data?.error || 'Unable to reach the prediction server. Ensure the Flask API is running.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Check if any fields have data for the live summary
  const getFilledFieldsSummary = () => {
    const summary = Object.entries(formData)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => ({
        key,
        title: fieldTitleMap[key],
        value: value,
      }));
    return summary;
  };

  const inputClassName = "mt-1.5 block w-full rounded-2xl border-0 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 transition-all placeholder:text-slate-400 hover:ring-rose-200 focus:bg-white focus:ring-2 focus:ring-rose-500 sm:text-sm";
  const labelClassName = "block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-indigo-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header with Title and Medical Icon */}
      <div className="w-full max-w-7xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <div className="inline-flex items-center justify-center p-3.5 bg-white rounded-3xl mb-4 text-indigo-600 shadow-xl border border-indigo-50">
            <FlaskConical size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-600 pb-2">
            AI Cardiac Insight Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-500 max-w-2xl">
            Input patient vitals and test results for a sophisticated cardiovascular risk assessment.
          </p>
        </div>
        <div className="w-full md:w-auto h-px md:h-24 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-stretch gap-8">
        
        {/* Form Container */}
        <div className="flex-1 rounded-[2.5rem] bg-white border border-slate-100 p-8 md:p-12 shadow-inner">
          <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            {/* Input blocks (using standard labels for now, keeping dynamic parts for viz) */}
            <label className={labelClassName}>
              Age
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} className={inputClassName} placeholder="e.g. 56" required />
            </label>

            <label className={labelClassName}>
              Sex
              <select name="Sex" value={formData.Sex} onChange={handleChange} className={inputClassName} required>
                <option value="" disabled>Select option</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </label>

            <label className={labelClassName}>
              Chest Pain Type
              <select name="Chest pain type" value={formData['Chest pain type']} onChange={handleChange} className={inputClassName} required>
                <option value="" disabled>Select option</option>
                <option value="1">Typical Angina</option>
                <option value="2">Atypical Angina</option>
                <option value="3">Non-anginal Pain</option>
                <option value="4">Asymptomatic</option>
              </select>
            </label>

            <label className={labelClassName}>
              Resting Blood Pressure
              <input type="number" name="BP" value={formData.BP} onChange={handleChange} className={inputClassName} placeholder="e.g. 140" required />
            </label>

            <label className={labelClassName}>
              Cholesterol
              <input type="number" name="Cholesterol" value={formData.Cholesterol} onChange={handleChange} className={inputClassName} placeholder="e.g. 250" required />
            </label>

            <label className={labelClassName}>
              FBS {'>'} 120
              <select name="FBS over 120" value={formData['FBS over 120']} onChange={handleChange} className={inputClassName} required>
                <option value="" disabled>Select option</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </label>

            <label className={labelClassName}>
              EKG Results
              <select name="EKG results" value={formData['EKG results']} onChange={handleChange} className={inputClassName} required>
                <option value="" disabled>Select option</option>
                <option value="0">Normal</option>
                <option value="1">ST-T Wave Abnormality</option>
                <option value="2">Left Ventricular Hypertrophy</option>
              </select>
            </label>

            <label className={labelClassName}>
              Max Heart Rate
              <input type="number" name="Max HR" value={formData['Max HR']} onChange={handleChange} className={inputClassName} placeholder="e.g. 150" required />
            </label>

            <label className={labelClassName}>
              Exercise Angina
              <select name="Exercise angina" value={formData['Exercise angina']} onChange={handleChange} className={inputClassName} required>
                <option value="" disabled>Select option</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </label>

            <label className={labelClassName}>
              ST Depression
              <input type="number" step="0.1" name="ST depression" value={formData['ST depression']} onChange={handleChange} className={inputClassName} placeholder="e.g. 1.5" required />
            </label>

            <label className={labelClassName}>
              Slope of ST
              <select name="Slope of ST" value={formData['Slope of ST']} onChange={handleChange} className={inputClassName} required>
                <option value="" disabled>Select option</option>
                <option value="1">Upsloping</option>
                <option value="2">Flat</option>
                <option value="3">Downsloping</option>
              </select>
            </label>

            <label className={labelClassName}>
              Number of Vessels Fluro
              <input type="number" name="Number of vessels fluro" value={formData['Number of vessels fluro']} onChange={handleChange} className={inputClassName} placeholder="0 to 3" min="0" max="3" required />
            </label>

            <label className={labelClassName}>
              Thallium
              <select name="Thallium" value={formData.Thallium} onChange={handleChange} className={inputClassName} required>
                <option value="" disabled>Select option</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </label>
            
            {/* Error Message and Action Button */}
            <div className="md:col-span-2 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center gap-6 justify-between mt-4">
              {error && (
                <div className="flex-1 w-full flex items-start gap-3 rounded-2xl bg-rose-50/80 p-4 border border-rose-200 text-rose-700">
                  <Activity size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )  (
                <div className="flex-1 invisible"></div> // Placeholder for layout
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-rose-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-rose-900/10 transition-all hover:shadow-2xl hover:scale-[1.02] hover:shadow-rose-900/20 focus:outline-none focus:ring-4 focus:ring-rose-500/50 disabled:opacity-70"
              >
                {loading ? 'Analyzing Data...' : 'Generate Risk Analysis'}
                <ArrowRight size={22} className="ml-1" />
              </button>
            </div>
          </form>
        </div>

        {/* Live visualization Dashboard Column */}
        <div className="w-full lg:w-[38%] rounded-[2.5rem] bg-gradient-to-br from-indigo-950 to-indigo-900 border border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-indigo-600 blur-[100px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-rose-500 blur-[100px] opacity-30"></div>

          <div className="relative z-10 flex flex-col h-full items-center justify-between">
            
            {/* Top Indicator */}
            <div className="w-full flex items-center justify-center gap-2.5 p-3 rounded-full bg-white/5 border border-white/10 text-rose-300">
                <HeartPulse size={20} strokeWidth={2} />
                <p className="text-sm uppercase tracking-widest font-bold">Current Vitals Profile</p>
            </div>

            {/* Dynamic Geometric Heart Avatar */}
            <div className="relative mt-8">
                <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-400 animate-ping opacity-70"></div>
                <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-400 opacity-70"></div>
                
                {/* SVG Geometric Heart (Minimalist High-tech Wireframe look) */}
                <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M110 33L135 15L150 20L165 30L175 40L185 55L190 70L190 85L185 100L175 115L110 170L45 115L35 100L30 85L30 70L35 55L45 40L55 30L70 20L85 15L110 33Z" 
                        stroke="url(#paint0_linear_geometric_heart)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        strokeDasharray="8 8"
                        className="animate-pulse"
                    />
                    <path d="M110 33L125 22L135 25L142 30L148 37L152 46L155 55L155 64L152 73L148 80L110 115L72 80L68 73L65 64L65 55L68 46L72 37L78 30L85 25L95 22L110 33Z" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeOpacity="0.4"
                    />
                    <defs>
                        <linearGradient id="paint0_linear_geometric_heart" x1="30" y1="92.5" x2="190" y2="92.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F43F5E"/>
                            <stop offset="0.5" stopColor="#E879F9"/>
                            <stop offset="1" stopColor="#F43F5E"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Live Profile Summary (Shows before prediction) */}
            <div className="w-full mt-10">
              <div className="text-center text-white text-lg font-extrabold pb-2 mb-4 border-b border-white/10">
                Patient Status (live)
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 text-white">
                {getFilledFieldsSummary().length === 0 ? (
                  <div className="col-span-full text-center text-indigo-200 text-sm italic py-4">
                    Enter details to see live summary...
                  </div>
                ) : (
                  getFilledFieldsSummary().map((item) => (
                    <div key={item.key} className="text-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <p className="text-[10px] font-semibold text-indigo-300 uppercase tracking-widest">{item.title}</p>
                      <p className="text-base font-bold text-white mt-1">{item.value}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Integrated Result Panel (Overlays dashboard with Glassmorphism) */}
            {result && (
              <div className="absolute inset-0 z-20 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-[16px]"></div>
                
                <div className="relative w-full h-full p-8 md:p-10 flex flex-col items-center justify-center gap-6">
                  {/* Subtle Glow beneath result */}
                  <div className={`absolute top-0 left-0 -ml-16 -mt-16 h-48 w-48 rounded-full ${result.Status.includes('Risk') ? 'bg-rose-500/30' : 'bg-emerald-500/30'} blur-[100px]`}></div>
                  
                  {/* Status Box */}
                  <div className="w-full flex items-center justify-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/10 text-white">
                    <CheckCircle2 size={24} strokeWidth={2} className={`${result.Status.includes('Risk') ? 'text-rose-300' : 'text-emerald-300'}`} />
                    <h2 className="text-3xl font-extrabold tracking-tighter text-white">
                      {result.Status}
                    </h2>
                  </div>
                  
                  {/* Probability Box */}
                  <div className="bg-white px-8 py-5 rounded-3xl shadow-xl shadow-indigo-950/20 border border-indigo-100 text-center">
                    <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Risk Probability</p>
                    <p className="text-4xl font-black text-rose-600">
                      {result['Risk probability']}
                    </p>
                  </div>
                  
                  {/* Acknowledge Button */}
                  <button 
                    onClick={() => setResult(null)} 
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-indigo-200 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
        
      </div>
    </div>
  );
}

export default HeartRiskPredictor;