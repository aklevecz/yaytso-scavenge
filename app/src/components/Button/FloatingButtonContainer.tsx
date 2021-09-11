type Props = {
  children: JSX.Element | JSX.Element[];
  top: string | number;
  right: string | number;
};

export default function FloatingButtonContainer({
  children,
  top,
  right,
}: Props) {
  return (
    <div style={{ top, right }} className="floating-button-container">
      {children}
    </div>
  );
}
