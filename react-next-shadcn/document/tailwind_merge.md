//https://github.com/dcastil/tailwind-merge

# tailwind-merge
Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts.
```
import { twMerge } from 'tailwind-merge'
twMerge('px-2 py-1 bg-red hover:bg-dark-red', 'p-3 bg-[#B91C1C]')
// → 'hover:bg-dark-red p-3 bg-[#B91C1C]'
```
Supports Tailwind v3.0 up to v3.4 (if you use Tailwind v2, use tailwind-merge v0.9.0)
Works in all modern browsers and maintained Node versions