const STATUS_STYLE = {
  empty:       { bg: '#D1FAE5', border: '#34C759', text: '#065F46' },
  occupied:    { bg: '#FEE2E2', border: '#FF3B30', text: '#991B1B' },
  recommended: { bg: '#DBEAFE', border: '#0057A8', text: '#1E3A5F' },
  disabled:    { bg: '#F3F4F6', border: '#D1D5DB', text: '#9CA3AF' },
};

export default function ParkingSlot({ slot, onClick, small = false }) {
  const style = STATUS_STYLE[slot.status] || STATUS_STYLE.empty;
  const size = small ? 28 : 40;
  const fontSize = small ? 8 : 10;

  return (
    <div
      onClick={() => onClick?.(slot)}
      style={{
        width: size,
        height: size,
        background: style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: small ? 4 : 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        flexDirection: 'column',
        transition: 'transform 0.1s, box-shadow 0.1s',
        boxShadow: slot.status === 'recommended' ? `0 0 0 3px #0057A820` : 'none',
        position: 'relative',
      }}
      title={slot.id}
    >
      <span style={{ fontSize, fontWeight: 600, color: style.text, lineHeight: 1 }}>
        {slot.id.replace('-', '\n')}
      </span>
      {slot.status === 'recommended' && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          background: '#0057A8', color: '#fff',
          borderRadius: '50%', width: 14, height: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700,
        }}>★</span>
      )}
    </div>
  );
}
