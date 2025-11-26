import { cn } from "../lib/utils";


export const Heading = ({

    title,
    className,
    size = 'default',
    as = 'h2', // default to h2
}) => {
    const styling = {
        default: 'text-base sm:text-xl 3xl:text-2xl',
        large: 'text-[40px] lg:text-5xl xl:text-6xl 3xl:text-8xl',
        medium: 'text-[40px] sm:text-5xl 3xl:text-[55px]',
        sm: 'text-base sm:text-lg',
        why_heading: 'sm:text-2xl text-xl 3xl:text-3xl',
        card: 'text-[28px] xl:text-[35px]',
        lg: 'sm:text-lg text-base 3xl:text-xl'
    };

    const Tag = as; // 'h1' or 'h2'

    return (
        <Tag className={cn('font-semibold capitalize leading-tight', styling[size], className)}>
            {title}
        </Tag>
    );
};
