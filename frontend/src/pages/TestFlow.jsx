import React, { useState } from 'react';
import { analyzeProduct } from '../services/searchService';

const TestFlow = () => {
  const [product, setProduct] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeProduct(product);
      setResult(res.result);
    } catch (err) {
      setError('Failed to analyze product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Test Product Environmental Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="Product Name"
          value={product}
          onChange={e => setProduct(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TestFlow;
