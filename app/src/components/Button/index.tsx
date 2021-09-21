export type Sizes = "xs" | "s" | "md" | "lg" | "flex" | "flex2";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  size?: Sizes;
  id?: string;
  width?: number | string;
  margin?: number | string;
  padding?: number | string;
};

export default function Button({
  name,
  onClick,
  className,
  size,
  id,
  width,
  margin,
  padding
}: Props) {
  return (
    <button
      id={id}
      className={`btn ${className} ${size}`}
      onClick={onClick}
      style={{ margin, padding, width }}
    >
      {name}
    </button>
  );
}
