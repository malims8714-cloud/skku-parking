import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherCard from '../components/WeatherCard.jsx';
import ParkingMap from '../components/ParkingMap.jsx';
import CampusMap from '../components/CampusMap.jsx';
import DestinationSelector from '../components/DestinationSelector.jsx';
import RecommendationCard from '../components/RecommendationCard.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import CongestionChart from '../components/CongestionChart.jsx';
import GuestBanner from '../components/auth/GuestBanner.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { generateInitialSlots } from '../data/parkingLots.js';
import { getCurrentWeather } from '../data/weatherParkingData.js';
import { getCurrentCongestion } from '../utils/congestionPredictor.js';
import { recommend } from '../utils/recommendation.js';

const TABS = [
  { id: 'home',    label: '홈',     icon: '🏠' },
  { id: 'map',     label: '지도',   icon: '🅿️' },
  { id: 'predict', label: '예측',   icon: '📊' },
  { id: 'admin',   label: '관리자', icon: '🔧' },
];

export default function ParkingApp() {
  const navigate = useNavigate();
  const { isGuest, isMember, user, signOut } = useAuth();

  const [activeTab, setActiveTab]   = useState('home');
  const [screen, setScreen]         = useState('home');
  const [mapView, setMapView]       = useState('campus');
  const [slots, setSlots]           = useState(() => generateInitialSlots());
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedVehicle, setSelectedVehicle]   = useState('normal');
  const [recommendResult, setRecommendResult]   = useState(null);

  const weather    = useMemo(() => getCurrentWeather(), []);
  const congestion = useMemo(() => getCurrentCongestion(weather.type), [weather.type]);

  const totalSlots    = slots.length;
  const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
  const emptySlots    = slots.filter(s => s.status === 'empty').length;
  const overallCongestion = Math.round((occupiedSlots / totalSlots) * 100);

  const handleRecommend = () => {
    const slotsForRec = slots.map(s =>
      s.status === 'recommended' ? { ...s, status: 'empty' } : s
    );
    const result = recommend({
      slots: slotsForRec,
      buildingId: selectedBuilding,
      vehicleType: selectedVehicle,
      weatherType: weather.type,
      congestion,
    });
    if (result) {
      setSlots(prev => prev.map(s =>
        s.id === result.slot.id ? { ...s, status: 'recommended' }
        : s.status === 'recommended' ? { ...s, status: 'empty' }
        : s
      ));
      setRecommendResult(result);
      setScreen('recommendation');
    }
  };

  const handleToggleSlot = (slotId) => {
    setSlots(prev => prev.map(s => {
      if (s.id !== slotId) return s;
      const next = s.status === 'empty' ? 'occupied' : s.status === 'occupied' ? 'empty' : s.status;
      return { ...s, status: next };
    }));
  };

  const congestionColor = overallCongestion >= 80 ? '#FF3B30'
    : overallCongestion >= 60 ? '#FF9500'
    : overallCongestion >= 40 ? '#FFCC00'
    : '#34C759';

  const renderContent = () => {
    if (activeTab === 'home') {
      if (screen === 'destination')    return renderDestination();
      if (screen === 'recommendation') return renderRecommendation();
      return renderHome();
    }
    if (activeTab === 'map')     return renderMapView();
    if (activeTab === 'predict') return renderPredict();
    if (activeTab === 'admin')   return renderAdmin();
  };

  const renderHome = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        background: 'linear-gradient(160deg, #003f7a 0%, #0057A8 50%, #1a6fc4 100%)',
        borderRadius: '0 0 28px 28px',
        padding: '32px 24px 28px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        marginTop: -20, marginLeft: -20, marginRight: -20,
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>성균관대학교 자연과학캠퍼스</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>SKKU Smart Parking</div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>경기도 수원시 장안구</div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>전체 혼잡도</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: congestionColor }}>{overallCongestion}%</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${overallCongestion}%`, background: congestionColor, borderRadius: 6, transition: 'width 0.5s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 12, opacity: 0.8 }}>전체 {totalSlots}면</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>빈자리 {emptySlots}면</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WeatherCard weather={weather} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: '전체',   value: totalSlots,    color: 'var(--primary)', icon: '🅿️' },
          { label: '사용중', value: occupiedSlots,  color: '#FF3B30',        icon: '🔴' },
          { label: '빈자리', value: emptySlots,     color: '#34C759',        icon: '🟢' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '16px 10px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
            <div style={{ fontSize: 24 }}>{icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={() => { setScreen('destination'); setActiveTab('home'); }}
          style={{ padding: '18px', background: 'var(--primary)', color: '#fff', borderRadius: 16, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 16px rgba(0,87,168,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          🎯 목적지 선택하기
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setActiveTab('map')}
            style={{ flex: 1, padding: '14px', background: '#fff', color: 'var(--primary)', borderRadius: 14, fontSize: 14, fontWeight: 600, border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            🅿️ 주차장 현황
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            style={{ flex: 1, padding: '14px', background: '#fff', color: 'var(--gray-700)', borderRadius: 14, fontSize: 14, fontWeight: 600, border: '2px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            🔧 관리자
          </button>
        </div>
      </div>
    </div>
  );

  const renderDestination = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setScreen('home')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gray-100)', color: 'var(--gray-700)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>목적지 선택</h2>
      </div>
      <DestinationSelector
        selected={selectedBuilding}
        vehicle={selectedVehicle}
        onSelectBuilding={setSelectedBuilding}
        onSelectVehicle={setSelectedVehicle}
        onRecommend={handleRecommend}
      />
    </div>
  );

  const renderRecommendation = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setScreen('destination')} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gray-100)', color: 'var(--gray-700)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>추천 결과</h2>
      </div>
      <RecommendationCard result={recommendResult} weather={weather} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <button onClick={() => setActiveTab('map')} style={{ padding: '16px', background: 'var(--primary)', color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 700, boxShadow: '0 4px 12px rgba(0,87,168,0.3)' }}>
          🅿️ 주차장 지도에서 확인
        </button>
        <button onClick={() => { setScreen('destination'); setRecommendResult(null); }} style={{ padding: '14px', background: '#fff', color: 'var(--gray-700)', borderRadius: 14, fontSize: 14, fontWeight: 600, border: '2px solid var(--gray-200)' }}>
          다시 검색
        </button>
      </div>
    </div>
  );

  const renderMapView = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>주차 현황</h2>
        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 3 }}>
          {[
            { id: 'campus', label: '🗺 지도' },
            { id: 'slots',  label: '🅿️ 구역별' },
          ].map(v => (
            <button key={v.id} onClick={() => setMapView(v.id)} style={{
              padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
              background: mapView === v.id ? '#fff' : 'transparent',
              color:      mapView === v.id ? 'var(--primary)' : '#9CA3AF',
              boxShadow:  mapView === v.id ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
              transition: 'all 0.15s',
            }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      {mapView === 'campus'
        ? <CampusMap slots={slots} congestion={congestion} />
        : <ParkingMap slots={slots} congestion={congestion} interactive={false} />
      }
    </div>
  );

  const renderPredict = () => (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>혼잡도 예측</h2>
      <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 20 }}>날씨·요일 기반 시간대별 혼잡도 예측</p>
      <CongestionChart weatherType={weather.type} />
    </div>
  );

  const renderAdmin = () => (
    <div>
      {/* 사용자 정보 + 로그아웃 */}
      <div style={{
        background: '#F8FAFC', borderRadius: 14, padding: '14px 16px',
        marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: '1px solid var(--gray-100)',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2 }}>
            {isGuest ? '비회원' : '로그인 계정'}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1E' }}>
            {isGuest ? '비회원으로 이용 중' : (user?.email ?? '알 수 없음')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isGuest && (
            <button
              onClick={() => navigate('/login')}
              style={{ background: '#0057A8', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              로그인
            </button>
          )}
          <button
            onClick={async () => { await signOut(); navigate('/login', { replace: true }); }}
            style={{ background: '#FF3B30', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            {isGuest ? '나가기' : '로그아웃'}
          </button>
        </div>
      </div>

      <AdminDashboard slots={slots} congestion={congestion} onToggleSlot={handleToggleSlot} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ height: 'env(safe-area-inset-top, 20px)', background: activeTab === 'home' && screen === 'home' ? 'var(--primary)' : '#fff' }} />

      {/* 비회원 배너 */}
      {isGuest && <GuestBanner />}

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', paddingBottom: 80 }}>
        {renderContent()}
      </div>

      {/* 하단 탭 바 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--gray-100)', display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', zIndex: 100,
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id === 'home') setScreen('home'); }}
              style={{ flex: 1, padding: '10px 4px 8px', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'opacity 0.1s' }}
            >
              <span style={{ fontSize: 22 }}>{tab.icon}</span>
              <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 400, color: isActive ? 'var(--primary)' : 'var(--gray-400)' }}>
                {tab.label}
              </span>
              {isActive && (
                <div style={{ width: 20, height: 3, background: 'var(--primary)', borderRadius: 2, position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom, 8px) + 2px)' }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
