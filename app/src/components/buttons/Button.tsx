type Sizes = "s" | "md" | "lg";

type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: Sizes;
  id?: string;
};

export default function Button({ name, onClick, size, id }: Props) {
  return (
    <button id={id} className={`btn ${size}`} onClick={onClick}>
      {name}
    </button>
  );
}
