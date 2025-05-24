type Props = {
  title: string
  onClick: () => void
  className?: string
}


export const Button = ({title, onClick, className}: Props) => {
  const onClickHandler = () => {
    onClick()
  }

  return (
    <button className={className} onClick={onClickHandler}>
      {title}
    </button>
  );
};
