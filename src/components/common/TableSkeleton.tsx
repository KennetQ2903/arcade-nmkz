
import {Skeleton} from "../ui/skeleton"


export const TableSkeleton=() => {
	return (
		<div className="space-y-3">
			<div className="gap-4">
				<Skeleton className="h-12 w-full" />
			</div>
			<div className="space-y-2">
				{
					[...Array(5)].map((_,idx) => (
						<div key={idx} className="grid grid-cols-4 gap-4">
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-8 w-full" />
						</div>
					))
				}
			</div>
		</div>
	)
}
