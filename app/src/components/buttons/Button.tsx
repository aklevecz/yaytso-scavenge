type Sizes = "s" | "md" | "lg";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: Sizes;
};

export default function Button({ name, onClick, size }: Props) {
  return (
    <button className={`btn ${size}`} onClick={onClick}>
      {name}
    </button>
  );
}
