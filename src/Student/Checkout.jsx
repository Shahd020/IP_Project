import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, CheckCircle, Loader, AlertCircle, Star, Clock } from 'lucide-react';
import useCourseById from '../hooks/useCourseById.js';
import apiClient from '../api/axios.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCardDisplay = (raw) =>
  raw.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const validate = (form) => {
  const errs = {};
  const cardRaw = form.cardNumber.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cardRaw)) errs.cardNumber = 'Card number must be exactly 16 digits.';

  const parts = form.expiry.split('/');
  const mm = parseInt(parts[0], 10);
  const yy = parseInt(parts[1], 10);
  const now = new Date();
  const expYear = 2000 + yy;
  const expMonth = mm;
  if (
    !parts[1] ||
    isNaN(mm) || mm < 1 || mm > 12 ||
    isNaN(yy) ||
    expYear < now.getFullYear() ||
    (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)
  ) {
    errs.expiry = 'Enter a valid expiry date (MM/YY).';
  }

  if (!/^\d{3}$/.test(form.cvv)) errs.cvv = 'CVV must be exactly 3 digits.';
  if (!form.nameOnCard.trim()) errs.nameOnCard = 'Name on card is required.';

  return errs;
};

// ── Component ─────────────────────────────────────────────────────────────────

function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { course, loading: courseLoading, error: courseError } = useCourseById(courseId);

  const [form, setForm] = useState({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCardNumber = (e) =>
    setForm((prev) => ({ ...prev, cardNumber: formatCardDisplay(e.target.value) }));

  const handleExpiry = (e) =>
    setForm((prev) => ({ ...prev, expiry: formatExpiry(e.target.value) }));

  const handleCvv = (e) =>
    setForm((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setProcessing(true);
    setPaymentError(null);
    try {
      await new Promise((res) => setTimeout(res, 1600)); // simulate gateway delay
      await apiClient.post('/enrollments', { courseId, status: 'in-progress' });
      navigate('/student');
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // ── Loading / error states ─────────────────────────────────────────────────
  if (courseLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-gray-400 gap-3">
        <Loader size={22} className="animate-spin" /> Loading course details…
      </div>
    );
  }
  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{courseError || 'Course not found.'}</p>
          <Link to="/catalog" className="mt-4 inline-block text-blue-400 hover:text-blue-300">← Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const price = course.price ?? 0;
  const PLACEHOLDER = 'https://placehold.co/400x200/1f2937/94a3b8?text=Course';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 sm:px-10 lg:px-20 py-10">
      <div className="max-w-5xl mx-auto">

        <Link
          to={`/course/${courseId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Back to Course
        </Link>

        <h1 className="text-3xl font-extrabold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Payment form ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 space-y-6">

            <div className="bg-[#1f2937] rounded-2xl border border-gray-800 p-6 space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard size={20} className="text-blue-400" /> Payment Details
              </h2>

              {/* Name on card */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name on Card</label>
                <input
                  type="text"
                  value={form.nameOnCard}
                  onChange={set('nameOnCard')}
                  placeholder="John Smith"
                  className={`w-full px-4 py-3 rounded-lg bg-[#0f172a] border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.nameOnCard ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.nameOnCard && <p className="text-red-400 text-xs mt-1">{errors.nameOnCard}</p>}
              </div>

              {/* Card number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cardNumber}
                    onChange={handleCardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0f172a] border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-12 ${errors.cardNumber ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.expiry}
                    onChange={handleExpiry}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0f172a] border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.expiry ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">CVV</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cvv}
                    onChange={handleCvv}
                    placeholder="123"
                    maxLength={3}
                    className={`w-full px-4 py-3 rounded-lg bg-[#0f172a] border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.cvv ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-700 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} /> {paymentError}
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-900/40"
            >
              {processing ? (
                <><Loader size={20} className="animate-spin" /> Processing Payment…</>
              ) : (
                <><Lock size={18} /> Pay ${price.toFixed(2)} Securely</>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <Lock size={12} /> 256-bit SSL encrypted. Your card details are never stored.
            </p>
          </form>

          {/* ── Order summary ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-[#1f2937] rounded-2xl border border-gray-800 overflow-hidden sticky top-8">
              <img
                src={course.thumbnail || PLACEHOLDER}
                alt={course.title}
                className="w-full h-44 object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />

              <div className="p-5 space-y-4">
                <h3 className="font-bold text-white text-base leading-snug">{course.title}</h3>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {course.rating > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                      <Star size={12} fill="currentColor" /> {course.rating.toFixed(1)}
                    </span>
                  )}
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {course.duration}
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5 text-sm text-gray-400 border-t border-gray-700 pt-4">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Full lifetime access</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Certificate of completion</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> Quizzes & exercises</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400" /> 30-day money-back guarantee</li>
                </ul>

                <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-2xl font-extrabold text-white">${price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
