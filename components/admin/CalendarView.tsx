'use client';

import { useState, useEffect } from 'react';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/calendar?month=${month}&year=${year}`);
      const data = await res.json();
      if (res.ok) setBookings(data.bookings);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    setSelectedDay(null);
  }, [month, year]);

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Lundi = 0, Dimanche = 6

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Fonction pour vérifier l'état d'un jour
  const getDayStatus = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    dateToCheck.setHours(12, 0, 0, 0); // Midi pour éviter les problèmes de fuseau horaire

    const dayBookings = bookings.filter(b => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      checkIn.setHours(12, 0, 0, 0);
      checkOut.setHours(12, 0, 0, 0);
      // Une réservation bloque du jour d'arrivée jusqu'au jour précédent le départ
      return dateToCheck >= checkIn && dateToCheck < checkOut;
    });

    if (dayBookings.some(b => b.status === 'CONFIRMED')) return 'confirmed';
    if (dayBookings.some(b => b.status === 'PENDING')) return 'pending';
    return 'available';
  };

  // Récupérer les détails d'un jour sélectionné
  const getSelectedDayBookings = () => {
    if (!selectedDay) return [];
    const dateToCheck = new Date(year, month, selectedDay);
    dateToCheck.setHours(12, 0, 0, 0);
    return bookings.filter(b => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      checkIn.setHours(12, 0, 0, 0);
      checkOut.setHours(12, 0, 0, 0);
      return dateToCheck >= checkIn && dateToCheck < checkOut;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête du calendrier */}
      <div className="flex justify-between items-center p-6 bg-emerald-900 text-white">
        <button onClick={prevMonth} className="p-2 hover:bg-emerald-800 rounded-lg transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="font-serif text-2xl font-bold">{monthNames[month]} {year}</h2>
        <button onClick={nextMonth} className="p-2 hover:bg-emerald-800 rounded-lg transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Grille du calendrier */}
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(d => <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase py-2">{d}</div>)}
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Chargement du calendrier...</div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Cases vides pour le début du mois */}
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg border border-transparent"></div>
            ))}

            {/* Jours du mois */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getDayStatus(day);
              const isSelected = selectedDay === day;
              
              let bgColor = "bg-white hover:bg-gray-50";
              let dotColor = "bg-emerald-500";
              if (status === 'confirmed') { bgColor = "bg-red-50 border-red-200 hover:bg-red-100"; dotColor = "bg-red-500"; }
              if (status === 'pending') { bgColor = "bg-amber-50 border-amber-200 hover:bg-amber-100"; dotColor = "bg-amber-500"; }

              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDay(day)}
                  className={`h-24 border rounded-lg p-2 cursor-pointer transition relative flex flex-col ${bgColor} ${isSelected ? 'ring-2 ring-emerald-600 border-transparent' : 'border-gray-100'}`}
                >
                  <span className={`text-sm font-bold ${isSelected ? 'text-emerald-700' : 'text-gray-700'}`}>{day}</span>
                  <div className="mt-auto flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {status === 'confirmed' ? 'Réservé' : status === 'pending' ? 'Attente' : 'Libre'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Détails du jour sélectionné */}
      {selectedDay && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-4">Détails du {selectedDay} {monthNames[month]} :</h3>
          {getSelectedDayBookings().length === 0 ? (
            <p className="text-emerald-600 text-sm font-medium">✅ Toutes les chambres sont disponibles ce jour-là.</p>
          ) : (
            <div className="space-y-3">
              {getSelectedDayBookings().map(b => (
                <div key={b.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{b.reference}</span>
                    <p className="font-medium text-gray-900 mt-1">{b.guestName}</p>
                    <p className="text-sm text-gray-500">{b.room.nameFr}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'CONFIRMED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {b.status === 'CONFIRMED' ? 'Réservé' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}