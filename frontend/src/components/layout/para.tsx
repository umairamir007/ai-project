import { cn } from '@/lib/utils';

interface ParaProps {
  para?: string;
  className?: string;
  size?: 'default' | 'large' | 'medium' | 'card';
}

export const Para: React.FC<ParaProps> = ({
  para,
  className,
  size = 'default',
}) => {
  const styling = {
    default: 'text-sm xl:text-base',
    medium: 'text-sm xs:text-base sm:text-lg md:text-xl xl:text-[25px]',
    large: 'text-base xxxs:text-lg sm:text-xl lg:text-2xl 3xl:text-[30px]',
    card: 'text-sm sm:text-base xl:text-lg text-center font-medium px-2',
  };

  return (
    <p className={cn('text-black ', styling[size], className)}>
      {para}
    </p>
  );
};
