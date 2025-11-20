import React, { useState, useEffect, useRef } from 'react';
import { BusinessCard } from './components/BusinessCard';
import { CardData, INITIAL_CARD_DATA } from './types';
import { processNaturalLanguageEdit } from './services/geminiService';
import { 
  PencilIcon, 
  SparklesIcon, 
  ArrowDownTrayIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/solid';
// @ts-ignore
import { toPng, toJpeg } from 'html-to-image';

export default function App() {
  const [cardData, setCardData] = useState<CardData>(INITIAL_CARD_DATA);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editMode, setEditMode] = useState<'manual' | 'ai'>('manual');
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Base width of card is now 2243px
        const newScale = Math.min(width / 2300, 1); 
        setScale(newScale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleAiEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsProcessing(true);
    try {
      const updatedData = await processNaturalLanguageEdit(cardData, prompt);
      setCardData(updatedData);
      setPrompt('');
    } catch (error) {
      alert('Възникна грешка при обработката с AI. Моля опитайте отново.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (format: 'png' | 'jpeg') => {
    const element = document.getElementById('card-download-area');
    if (!element) return;

    try {
      const options = {
        cacheBust: true,
        width: 2243,
        height: 341,
        style: {
           transform: 'scale(1)',
           transformOrigin: 'top left',
           margin: '0'
        },
        backgroundColor: '#ffffff', // White background is crucial for JPEGs
      };

      let dataUrl;
      if (format === 'jpeg') {
        dataUrl = await toJpeg(element, { ...options, quality: 0.95 });
      } else {
        dataUrl = await toPng(element, options);
      }

      const link = document.createElement('a');
      link.download = `dimov-logo.${format === 'jpeg' ? 'jpg' : 'png'}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading image:', err);
      alert('Неуспешно запазване на изображението.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
        <div className="max-w-[1350px] mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-red-600 text-3xl">D</span> 
            Dimov Editor
          </h1>
          <div className="text-sm text-gray-500 hidden sm:block">
            Редактирайте или използвайте AI за корекции
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8 w-full max-w-[1350px] mx-auto flex flex-col gap-8">
        
        {/* Preview Section */}
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-md flex flex-col items-center justify-center min-h-[220px] overflow-hidden relative border border-gray-200">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
               <h2 className="text-gray-400 text-sm uppercase font-bold tracking-wider">Live Preview</h2>
               <div className="flex gap-2">
                   <button 
                      onClick={() => handleDownload('jpeg')}
                      className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                   >
                      <ArrowDownTrayIcon className="w-4 h-4 text-gray-500" />
                      JPG
                   </button>
                   <button 
                      onClick={() => handleDownload('png')}
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                   >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      PNG
                   </button>
               </div>
            </div>
            
            <div ref={containerRef} className="w-full flex justify-center h-[200px] sm:h-[200px] items-center overflow-hidden">
                <div style={{ 
                  width: 2243 * scale, 
                  height: 341 * scale,
                  flexShrink: 0
                }}>
                     <BusinessCard data={cardData} scale={scale} />
                </div>
            </div>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Mode Selection */}
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Инструменти</h3>
                <div className="flex gap-2 mb-6">
                   <button
                      onClick={() => setEditMode('manual')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                        editMode === 'manual' 
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/20' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                   >
                      <PencilIcon className="w-4 h-4" />
                      Ръчно
                   </button>
                   <button
                      onClick={() => setEditMode('ai')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                        editMode === 'ai' 
                          ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-700/20' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                   >
                      <SparklesIcon className="w-4 h-4" />
                      AI Асистент
                   </button>
                </div>

                {editMode === 'ai' && (
                   <form onSubmit={handleAiEdit} className="space-y-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                            Какво искате да промените?
                         </label>
                         <div className="relative">
                           <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="Например: Смени телефона на Пламен с 0888..."
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 min-h-[100px] p-3 text-sm"
                           />
                           <div className="absolute bottom-2 right-2">
                             {isProcessing ? (
                               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                             ) : (
                               <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                             )}
                           </div>
                         </div>
                      </div>
                      <button
                         type="submit"
                         disabled={isProcessing || !prompt.trim()}
                         className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                      >
                         <SparklesIcon className="w-4 h-4" />
                         Изпълни промяната
                      </button>
                   </form>
                )}
             </div>
          </div>

          {/* Right: Manual Form */}
          <div className="lg:col-span-2">
            {editMode === 'manual' ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">Данни на фирмата</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-1">Контакти</h4>
                       <div>
                          <label className="block text-sm font-medium text-gray-700">Имейл</label>
                          <input type="text" name="email1" value={cardData.email1} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700">Уебсайт</label>
                          <input type="text" name="website" value={cardData.website} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700">Адрес</label>
                          <input type="text" name="address" value={cardData.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-1">Служители</h4>
                       <div className="grid grid-cols-2 gap-2">
                          <input type="text" name="phone1" value={cardData.phone1} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Телефон" />
                          <input type="text" name="person1" value={cardData.person1} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Име" />
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <input type="text" name="phone2" value={cardData.phone2} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Телефон" />
                          <input type="text" name="person2" value={cardData.person2} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Име" />
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <input type="text" name="phone3" value={cardData.phone3} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Телефон" />
                          <input type="text" name="person3" value={cardData.person3} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Име" />
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
               <div className="bg-purple-50 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] border-2 border-dashed border-purple-200">
                  <SparklesIcon className="w-12 h-12 text-purple-300 mb-4" />
                  <h3 className="text-lg font-medium text-purple-900">AI Режим е активен</h3>
                  <p className="text-purple-600 max-w-sm mt-2">
                     Използвайте панела отляво, за да опишете промените, които искате да направите.
                  </p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}