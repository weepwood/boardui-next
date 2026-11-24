import { Badge as Counter } from "@/packages/react/badge";
import { Chip as Status } from "@/packages/react/chip";
export type BadgeVariant="neutral"|"accent"|"success"|"warning"|"danger"|"pro";
const colors={success:"lime",warning:"yellow",danger:"rose",pro:"purple"} as const;
export function Badge({variant="neutral",className,children}:{variant?:BadgeVariant;className?:string;children:React.ReactNode}){
 return variant==="neutral"||variant==="accent"?<Counter color={variant==="accent"?"primary":"neutral"} className={className}>{children}</Counter>:<Status color={colors[variant]} variant="caption" className={className}>{children}</Status>;
}
