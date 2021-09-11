export type Sizes = "xs" | "s" | "md" | "lg" | "flex";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  size?: Sizes;
  id?: string;
  width?: number | string;
};

export default function Button({
  name,
  onClick,
  className,
  size,
  id,
  width,
}: Props) {
  return (
    <button
      id={id}
      className={`btn ${className} ${size}`}
      onClick={onClick}
      style={{ width }}
    >
      {name}
    </button>
  );
}
