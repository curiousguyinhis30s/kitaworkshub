"use client";

import { useState } from 'react';
import PortalLayout from '../components/PortalLayout';
import { SearchIcon } from '../../components/icons/CustomIcons';
import { FileText, Archive, FileSpreadsheet, Download, FolderOpen, CheckCircle } from 'lucide-react';

const resources = [
  { id: 1, title: "PMO Setup Checklist", subtitle: "2025 Edition", type: "PDF", size: "2.3 MB", category: "PMO", downloaded: true, description: "Complete checklist for setting up a Project Management Office from scratch." },
  { id: 2, title: "Agile Retrospective Toolkit", subtitle: "Templates & Guides", type: "ZIP", size: "1.8 MB", category: "Agile", downloaded: true, description: "Collection of retrospective formats, activities, and facilitation guides." },
  { id: 3, title: "Leadership Self-Assessment", subtitle: "Framework", type: "XLSX", size: "450 KB", category: "Leadership", downloaded: false, description: "Evaluate your leadership competencies across 8 key dimensions." },
  { id: 4, title: "Stakeholder Mapping Canvas", subtitle: "Strategic Tool", type: "PDF", size: "980 KB", category: "PMO", downloaded: false, description: "Visual template for identifying and analyzing project stakeholders." },
  { id: 5, title: "Sprint Planning Template", subtitle: "Scrum Artifact", type: "XLSX", size: "320 KB", category: "Agile", downloaded: true, description: "Ready-to-use template for planning and tracking sprints." },
  { id: 6, title: "Executive Communication", subtitle: "Best Practices Guide", type: "PDF", size: "1.5 MB", category: "Leadership", downloaded: false, description: "Master the art of communicating with C-suite executives." },
];

const categories = ["All", "PMO", "Agile", "Leadership"];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'PDF': return FileText;
    case 'ZIP': return Archive;
    case 'XLSX': return FileSpreadsheet;
    default: return FileText;
  }
};

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredResources = resources.filter(r => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PortalLayout title="Resources">
      {/* Stats - Clean text, no colored pills */}
      <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
        <span>{resources.length} resources</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{resources.filter(r => r.downloaded).length} downloaded</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{categories.length - 1} categories</span>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type);
          return (
            <div key={resource.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-6 h-6 text-primary-700" />
                  </div>

                  {/* Title & Meta */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 leading-tight">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.subtitle}</p>
                  </div>

                  {/* Downloaded indicator */}
                  {resource.downloaded && (
                    <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {resource.description}
                </p>

                {/* Meta row */}
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-gray-100 rounded font-medium text-gray-600">
                    {resource.type}
                  </span>
                  <span>{resource.size}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{resource.category}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                  {resource.downloaded ? (
                    <>
                      <FolderOpen className="w-4 h-4" />
                      Open Resource
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No resources found matching your criteria.</p>
        </div>
      )}
    </PortalLayout>
  );
}
