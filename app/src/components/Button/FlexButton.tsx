import Button from ".";

type Props = {
  name: string;
  width?: number;
};

export default function FlexButton({ name, width }: Props) {
  console.log("hi");
  return (
    <Button
      size="flex"
      name={name}
      width={width}
      onClick={() => console.log("hi")}
    />
  );
}
