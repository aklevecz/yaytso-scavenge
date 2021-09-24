export type Sizes = "xs" | "s" | "md" | "lg" | "flex" | "flex2";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  size?: Sizes;
  id?: string;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  margin?: number | string;
  padding?: number | string;
  display?: string;
};

export default function Button({
  name,
  onClick,
  className,
  size,
  id,
  width,
  height,
  maxWidth,
  margin,
  padding,
  display,
}: Props) {
  return (
    <button
      id={id}
      className={`btn ${className} ${size}`}
      onClick={onClick}
      style={{ margin, padding, width, height, maxWidth, display }}
    >
      {name}
    </button>
  );
}
