import { ButtonOrLink, Props as ButtonOrLinkProps } from './ButtonOrLink';

export function Button({ ...props }: ButtonOrLinkProps) {
	return <ButtonOrLink {...props} />;
}
