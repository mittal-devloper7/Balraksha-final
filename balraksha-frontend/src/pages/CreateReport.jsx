import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Send, Plus, X } from 'lucide-react';
import AppShell from '../components/AppShell';
import MobileNav from '../components/MobileNav';
import Card from '../components/Card';
import Button from '../components/Button';
import { analyzeThreat } from '../services/threatService';

const CATEGORIES = [
  'GROOMING',
  'BULLYING',
  'HARASSMENT',
  'THREAT',
  'PERSONAL_INFORMATION_REQUEST',
  'OTHER'
];

export default function CreateReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    riskScore: 50,
    category: CATEGORIES[0],
    description: '',
    anonymous: false,
    signals: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const addSignal = () => {
    setFormData(prev => ({
      ...prev,
      signals: [
        ...prev.signals, 
        { signal: '', description: '', weight: 10 }
      ]
    }));
  };

  const removeSignal = (index) => {
    setFormData(prev => ({
      ...prev,
      signals: prev.signals.filter((_, i) => i !== index)
    }));
  };

  const handleSignalChange = (index, field, value) => {
    const newSignals = [...formData.signals];
    newSignals[index] = {
      ...newSignals[index],
      [field]: field === 'weight' ? Number(value) : value
    };
    setFormData(prev => ({ ...prev, signals: newSignals }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setError('Description is required.');
      return;
    }
    
    // Validate signals
    for (let i = 0; i < formData.signals.length; i++) {
      const s = formData.signals[i];
      if (!s.signal.trim() || !s.description.trim()) {
        setError(`Signal #${i + 1} is missing a name or description.`);
        return;
      }
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      await analyzeThreat(formData);
      setSuccess('Report submitted successfully.');
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="page narrow">
        <button type="button" className="back-inline" onClick={() => navigate('/reports')}>
          <ArrowLeft size={17} /> Back to reports
        </button>
        <div className="page-header">
          <div>
            <span className="eyebrow">Manual Submission</span>
            <h1>Create New Report</h1>
            <p>Submit a new safety concern to BalRaksha.</p>
          </div>
        </div>

        {error && <div className="alert error" role="alert">{error}</div>}
        {success && <div className="alert success" role="status">{success}</div>}

        <Card>
          <div className="form-heading">
            <h2>Report details</h2>
            <p>Provide as much information as possible.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="category-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <label className="field">
                <span>Category</span>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  disabled={submitting}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Risk Score (0-100)</span>
                <input 
                  type="number"
                  name="riskScore" 
                  min="0"
                  max="100"
                  value={formData.riskScore} 
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </label>
            </div>
            
            <label className="field">
              <span>Description</span>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                placeholder="Explain what happened..."
                disabled={submitting}
                required
                rows={4}
              />
            </label>
            
            <label className="anonymous-box">
              <div className="anon-icon"><ShieldAlert size={20} /></div>
              <div>
                <strong>Submit anonymously</strong>
                <p>Your identity will be hidden in this report.</p>
              </div>
              <input 
                type="checkbox" 
                name="anonymous" 
                checked={formData.anonymous} 
                onChange={handleChange}
                disabled={submitting}
              />
            </label>

            <div className="form-heading" style={{ marginTop: '30px', borderTop: '1px solid #edf3f7', paddingTop: '20px' }}>
              <h2>Risk Signals</h2>
              <p>Add specific signals that characterize this threat.</p>
            </div>

            {formData.signals.length === 0 && (
              <div className="muted" style={{ padding: '0 0 20px' }}>No signals added yet.</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {formData.signals.map((signal, index) => (
                <div key={index} style={{ padding: '15px', border: '1px solid #dcecf7', borderRadius: '15px', background: '#fbfdff', position: 'relative' }}>
                  <button 
                    type="button" 
                    onClick={() => removeSignal(index)}
                    style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'transparent', color: '#a72a2a' }}
                    title="Remove signal"
                  >
                    <X size={18} />
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px' }}>
                    <label className="field" style={{ margin: 0 }}>
                      <span>Signal Name</span>
                      <input 
                        type="text" 
                        value={signal.signal} 
                        onChange={(e) => handleSignalChange(index, 'signal', e.target.value)}
                        placeholder="e.g. SECRECY_REQUEST"
                        disabled={submitting}
                        required
                      />
                    </label>
                    <label className="field" style={{ margin: 0 }}>
                      <span>Weight</span>
                      <input 
                        type="number" 
                        min="0"
                        value={signal.weight} 
                        onChange={(e) => handleSignalChange(index, 'weight', e.target.value)}
                        disabled={submitting}
                        required
                      />
                    </label>
                  </div>
                  <label className="field" style={{ marginTop: '10px' }}>
                    <span>Signal Description</span>
                    <textarea 
                      value={signal.description} 
                      onChange={(e) => handleSignalChange(index, 'description', e.target.value)}
                      placeholder="Describe why this signal was added..."
                      disabled={submitting}
                      required
                      style={{ minHeight: '60px' }}
                    />
                  </label>
                </div>
              ))}
            </div>

            <Button type="button" variant="secondary" onClick={addSignal} disabled={submitting} style={{ marginBottom: '30px' }}>
              <Plus size={16} /> Add Signal
            </Button>

            <div className="split-actions">
              <Button type="button" variant="secondary" onClick={() => navigate('/reports')} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || success}>
                {submitting ? 'Submitting...' : 'Submit Report'} <Send size={18} />
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <MobileNav />
    </AppShell>
  );
}
