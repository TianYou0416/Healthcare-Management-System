import { Newspaper, TrendingUp, Activity, Heart } from 'lucide-react';

const healthNews = [
  {
    id: 1,
    title: 'New Research Shows Benefits of Regular Exercise on Heart Health',
    summary: 'Recent studies demonstrate that 30 minutes of daily exercise can reduce cardiovascular disease risk by up to 35%.',
    category: 'Cardiovascular',
    date: 'February 1, 2026',
    source: 'Medical Journal',
  },
  {
    id: 2,
    title: 'Advances in AI-Powered Diagnostic Tools',
    summary: 'Machine learning algorithms are now able to detect early signs of diseases with unprecedented accuracy.',
    category: 'Technology',
    date: 'January 28, 2026',
    source: 'Health Tech News',
  },
  {
    id: 3,
    title: 'Understanding Mental Health: Breaking the Stigma',
    summary: 'Mental health awareness campaigns are helping more people seek professional support for psychological well-being.',
    category: 'Mental Health',
    date: 'January 25, 2026',
    source: 'Psychology Today',
  },
  {
    id: 4,
    title: 'Nutrition Guidelines Updated for 2026',
    summary: 'New dietary recommendations emphasize plant-based foods and reduced processed sugar intake.',
    category: 'Nutrition',
    date: 'January 20, 2026',
    source: 'Nutrition Institute',
  },
  {
    id: 5,
    title: 'Telemedicine: The Future of Healthcare Access',
    summary: 'Virtual consultations continue to improve healthcare accessibility for patients in remote areas.',
    category: 'Telemedicine',
    date: 'January 15, 2026',
    source: 'Healthcare Innovation',
  },
  {
    id: 6,
    title: 'Preventive Care: Early Detection Saves Lives',
    summary: 'Regular health screenings and preventive check-ups are crucial for detecting conditions before they become serious.',
    category: 'Prevention',
    date: 'January 10, 2026',
    source: 'Public Health Journal',
  },
];

const healthTips = [
  {
    icon: Activity,
    title: 'Stay Active',
    description: 'Aim for at least 150 minutes of moderate aerobic activity per week.',
  },
  {
    icon: Heart,
    title: 'Heart Health',
    description: 'Monitor your blood pressure and cholesterol levels regularly.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Health',
    description: 'Keep records of your medical history and medications.',
  },
];

export function HealthInformation() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Health Information</h1>
        <p className="text-gray-600">Stay informed with the latest healthcare news and medical articles</p>
      </div>

      {/* Health Tips Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {healthTips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{tip.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          );
        })}
      </div>

      {/* Health News Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Latest Health News</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {healthNews.map((article) => (
            <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-3">{article.summary}</p>
                  <p className="text-sm text-gray-500">Source: {article.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
