type Props = {
  children: JSX.Element | JSX.Element[];
  top?: string | number;
  bottom?: string | number;
  right: string | number;
};

export default function FloatingButtonContainer({
  children,
  top,
  bottom,
  right,
}: Props) {
  return (
    <div style={{ top, bottom, right }} className="floating-button-container">
      {children}
    </div>
  );
}
