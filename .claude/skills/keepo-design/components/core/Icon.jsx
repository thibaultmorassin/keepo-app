export function Icon({ name, size = 20, strokeWidth = 2.25, color = 'currentColor', style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) window.lucide.createIcons({ nameAttr: 'data-lucide', root: ref.current });
  }, [name, size, strokeWidth]);
  return (
    <span ref={ref} style={{ display: 'inline-flex', color, lineHeight: 0, ...style }}>
      <i data-lucide={name} width={size} height={size} stroke-width={strokeWidth}></i>
    </span>
  );
}
