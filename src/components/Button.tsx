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
		<button onClick={onClickHandler} className={className}>
			{title}
		</button>
	);
};
