type Props = {
  title: string
  onClick: () => void
}


export const Button = ({title, onClick}: Props) => {
  const onClickHandler = () => {
    onClick()
  }

  return (
    <button onClick={onClickHandler}>
      {title}
    </button>
  );
};
