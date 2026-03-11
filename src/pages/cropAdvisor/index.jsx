import { useState } from 'react'
import { Sprout, Send, Sparkles, ChevronRight, Loader, Leaf, Droplets, Sun, TrendingUp, ThumbsUp, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

const cropTypes = ['Wheat', 'Rice', 'Corn', 'Tomato', 'Cotton', 'Sugarcane', 'Soybean', 'Potato', 'Onion', 'Mustard']
const soilTypes = ['Clay', 'Sandy', 'Loam', 'Silt', 'Peaty', 'Chalky', 'Sandy Loam', 'Clay Loam']
const seasons = ['Kharif (Jun-Oct)', 'Rabi (Oct-Mar)', 'Zaid (Mar-Jun)']
const regions = ['Punjab', 'Haryana', 'Maharashtra', 'West Bengal', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Karnataka']

const quickQuestions = [
    'What fertilizer should I use for wheat in clay soil?',
    'How to prevent fungal diseases in rice?',
    'Best irrigation schedule for summer cotton?',
    'When is the ideal time to harvest tomatoes?',
]

const sampleResponse = {
    crop: 'Wheat',
    confidence: 94,
    summary: 'Based on your inputs — clay loam soil in Punjab, Rabi season — here are your personalized recommendations for wheat cultivation.',
    recommendations: [
        {
            category: 'Soil Preparation',
            icon: Leaf,
            color: '#22c55e',
            items: [
                'Deep ploughing to 20-25 cm depth before sowing',
                'Apply 25 tonnes/hectare of well-decomposed FYM',
                'Target pH between 6.5-7.5 (currently optimal)',
                'Subsoil tillage every 3-4 years to break hardpan',
            ]
        },
        {
            category: 'Fertilizer Schedule',
            icon: Sprout,
            color: '#f59e0b',
            items: [
                'Basal: 120 kg N, 60 kg P₂O₅, 40 kg K₂O per hectare',
                'Apply half nitrogen at sowing, rest at tillering stage',
                'Use urea (46% N) as nitrogen source for cost efficiency',
                'Zinc sulphate @25 kg/ha if deficient (check soil test)',
            ]
        },
        {
            category: 'Irrigation Plan',
            icon: Droplets,
            color: '#38bdf8',
            items: [
                '4-5 critical irrigations: CRI, tillering, jointing, flowering, grain fill',
                'First irrigation (CRI) at 20-25 days after sowing',
                'Avoid irrigation at pre-harvest stage (2 weeks before harvest)',
                'Use flood or furrow irrigation; drip reduces water by 35%',
            ]
        },
        {
            category: 'Weather Advisory',
            icon: Sun,
            color: '#a78bfa',
            items: [
                'Sow between Nov 15-Dec 15 for optimal temperature (18-22°C)',
                'Late sowing reduces yield by 30-35 kg/ha/day delay',
                'Protect from frost during grain filling (Feb-Mar)',
                'Alert: Extended blight conditions expected Jan 2nd week',
            ]
        },
    ],
    expectedYield: '5.2 - 5.8 tonnes/hectare',
    riskLevel: 'Low',
    marketTip: 'Wheat MSP for 2025-26 is ₹2,275/quintal. Consider storing until May-June for 12-18% price premium.',
}

export default function CropAdvisor() {
    const [formData, setFormData] = useState({
        crop: '', soil: '', season: '', region: '',
        area: '', rainfall: 'moderate', query: '',
    })
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)
    const [chatMessages, setChatMessages] = useState([])
    const [chatInput, setChatInput] = useState('')

    const handleAnalyze = async () => {
        if (!formData.crop || !formData.soil) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 2200))
        setLoading(false)
        setResponse(sampleResponse)
    }

    const handleQuickQ = (q) => {
        setChatInput(q)
    }

    const handleChat = async () => {
        if (!chatInput.trim()) return
        const userMsg = { role: 'user', text: chatInput }
        setChatMessages(prev => [...prev, userMsg])
        setChatInput('')
        await new Promise(r => setTimeout(r, 1200))
        const aiMsg = {
            role: 'ai',
            text: `Based on agricultural data and AI analysis: ${chatInput.includes('fertilizer') ?
                'For wheat in clay soil, apply NPK 120:60:40 kg/ha. Use urea as nitrogen source and single super phosphate for phosphorus. Apply 50% N at sowing and remaining at crown root initiation stage.' :
                chatInput.includes('fungal') ?
                    'To prevent fungal diseases in rice: use certified disease-free seeds, maintain proper spacing (20×15 cm), apply propiconazole @1 mL/L water at booting stage, and ensure proper drainage.' :
                    'Our AI recommends crop-specific practices tailored to your region and season. Please provide more details about your farm conditions for personalized advice.'
                }`
        }
        setChatMessages(prev => [...prev, aiMsg])
    }

    return (
        <div style={{ padding: 28 }} className="page-enter">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* LEFT: Input Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{
                                width: 44, height: 44,
                                background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
                                borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(34,197,94,0.2)',
                            }}>
                                <Sprout size={20} color="#22c55e" />
                            </div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Farm Details</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tell us about your farm for personalized advice</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label className="label">Crop Type *</label>
                                <select className="select" value={formData.crop} onChange={e => setFormData({ ...formData, crop: e.target.value })}>
                                    <option value="">Select crop</option>
                                    {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Soil Type *</label>
                                <select className="select" value={formData.soil} onChange={e => setFormData({ ...formData, soil: e.target.value })}>
                                    <option value="">Select soil</option>
                                    {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Season</label>
                                <select className="select" value={formData.season} onChange={e => setFormData({ ...formData, season: e.target.value })}>
                                    <option value="">Select season</option>
                                    {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Region / State</label>
                                <select className="select" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })}>
                                    <option value="">Select region</option>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Farm Area (acres)</label>
                                <input className="input" type="number" placeholder="e.g., 5" value={formData.area}
                                    onChange={e => setFormData({ ...formData, area: e.target.value })} />
                            </div>
                            <div>
                                <label className="label">Rainfall Pattern</label>
                                <select className="select" value={formData.rainfall} onChange={e => setFormData({ ...formData, rainfall: e.target.value })}>
                                    <option value="low">Low (under 500mm)</option>
                                    <option value="moderate">Moderate (500-1000mm)</option>
                                    <option value="high">High (above 1000mm)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: 16 }}>
                            <label className="label">Specific Question (optional)</label>
                            <textarea
                                className="input"
                                placeholder="e.g., My wheat leaves are turning yellow at the tips. What should I do?"
                                rows={3}
                                value={formData.query}
                                onChange={e => setFormData({ ...formData, query: e.target.value })}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 20, height: 48, fontSize: 15, justifyContent: 'center' }}
                            onClick={handleAnalyze}
                            disabled={loading || !formData.crop || !formData.soil}
                        >
                            {loading ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    AI is analyzing your farm data...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    Get AI Recommendations
                                </>
                            )}
                        </button>
                    </div>

                    {/* Chat Interface */}
                    <div className="card" style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Ask AI Anything</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Quick questions about farming practices</div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {quickQuestions.map((q, i) => (
                                <button key={i} onClick={() => handleQuickQ(q)}
                                    style={{
                                        padding: '6px 12px', background: 'rgba(34,197,94,0.08)',
                                        border: '1px solid rgba(34,197,94,0.15)', borderRadius: 100,
                                        fontSize: 12, color: 'var(--accent-secondary)', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(34,197,94,0.15)'}
                                    onMouseLeave={e => e.target.style.background = 'rgba(34,197,94,0.08)'}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        <div style={{
                            minHeight: 150, maxHeight: 200, overflowY: 'auto',
                            background: 'rgba(255,255,255,0.02)', borderRadius: 10,
                            border: '1px solid var(--border-subtle)',
                            padding: 14, marginBottom: 12,
                            display: 'flex', flexDirection: 'column', gap: 10,
                        }}>
                            {chatMessages.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 40 }}>
                                    Ask your farming question above
                                </div>
                            ) : chatMessages.map((msg, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: 10, alignItems: 'flex-start',
                                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                        background: msg.role === 'user' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700, color: 'white',
                                    }}>
                                        {msg.role === 'user' ? 'R' : 'AI'}
                                    </div>
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '10px 14px',
                                        background: msg.role === 'user' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                                        border: '1px solid',
                                        borderColor: msg.role === 'user' ? 'rgba(34,197,94,0.2)' : 'var(--border-subtle)',
                                        borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                        fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5,
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                className="input"
                                placeholder="Ask about crops, soil, pests..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleChat()}
                                style={{ flex: 1 }}
                            />
                            <button className="btn btn-primary" onClick={handleChat} style={{ padding: '12px 16px', flexShrink: 0 }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: AI Response */}
                <div>
                    {!response && !loading && (
                        <div style={{
                            height: '100%', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center',
                            minHeight: 400,
                        }}>
                            <div style={{
                                width: 80, height: 80,
                                background: 'rgba(34,197,94,0.1)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 20, fontSize: 36,
                            }} className="animate-float">
                                🌾
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                                AI Crop Advisor Ready
                            </h3>
                            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 280 }}>
                                Fill in your farm details on the left and click "Get AI Recommendations" for personalized guidance.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            minHeight: 400,
                            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)', padding: 48, textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 20 }}>🤖</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                                AI Processing...
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                                Analyzing soil data, weather patterns, and crop databases
                            </div>
                            <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'var(--text-muted)' }}>
                                {['Soil Analysis', 'Weather Match', 'Crop Database', 'Generating Report'].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Loader size={11} className="animate-spin" style={{ color: '#22c55e' }} />
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {response && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
                            {/* Header */}
                            <div className="card" style={{
                                background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
                                border: '1px solid rgba(34,197,94,0.2)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                                            {response.crop} — AI Report
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{response.summary}</div>
                                    </div>
                                    <div className="badge badge-green" style={{ flexShrink: 0 }}>
                                        <Sparkles size={11} /> {response.confidence}% confidence
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expected Yield</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>{response.expectedYield}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Risk Level</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>{response.riskLevel}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations Grid */}
                            {response.recommendations.map((rec, i) => (
                                <div key={i} className="card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                        <div style={{
                                            width: 32, height: 32,
                                            background: `${rec.color}18`,
                                            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <rec.icon size={16} color={rec.color} />
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{rec.category}</span>
                                    </div>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {rec.items.map((item, j) => (
                                            <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                <ChevronRight size={14} color={rec.color} style={{ marginTop: 2, flexShrink: 0 }} />
                                                <span style={{ fontSize: 13, color: 'var(--gray-300)', lineHeight: 1.5 }}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* Market Tip */}
                            <div className="alert alert-success">
                                <TrendingUp size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 2 }}>Market Intelligence</div>
                                    <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>{response.marketTip}</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}
                                    onClick={() => {
                                        const reportText = `CROP ADVISOR REPORT\n\nCrop: ${response.crop}\nField: ${response.field}\nSoil: ${response.soil}\nConfidence: ${response.confidence}%\nSeason: ${response.bestSeason}\n\nGenerated by AgroMind AI`
                                        const blob = new Blob([reportText], { type: 'text/plain' })
                                        const link = document.createElement('a')
                                        link.href = URL.createObjectURL(blob)
                                        link.download = `crop-report-${response.crop}.txt`
                                        document.body.appendChild(link)
                                        link.click()
                                        document.body.removeChild(link)
                                        toast.success('📄 Crop report saved!')
                                    }}>
                                    <ThumbsUp size={14} /> Save Report
                                </button>
                                <button className="btn btn-ghost" onClick={() => setResponse(null)} style={{ flex: 1, justifyContent: 'center' }}>
                                    <RotateCcw size={14} /> New Analysis
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
