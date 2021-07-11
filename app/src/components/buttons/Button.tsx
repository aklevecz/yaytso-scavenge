type Props = {
  name: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function Button({ name, onClick }: Props) {
  return (
    <button className="btn" onClick={onClick}>
      {name}
    </button>
  );
}
