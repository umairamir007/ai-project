import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";

const COLOR_PRESETS = [
    "#875606", "#D31033", "#FF6712", "#F69307", "#0BA38A", "#57A00B",
    "#099CDB", "#0F3A91", "#DD2C88", "#AF13CE", "#FF64FF", "#425469"
];

export function BrandColorPicker({
    value,
    onChange,
    label = "Brand Color",
}: {
    value: string;
    onChange: (color: string) => void;   // ✅ accept color
    label?: string;
}) {
    const hexNoHash = value.toUpperCase();

    return (
        <div className="space-y-2">
            <label className="block text-lg font-medium text-[#4B607D]">
                {label}
            </label>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        className="group flex h-12 w-full items-center justify-between rounded-2xl border border-[#C9D3E0] pl-3 pr-1 text-left shadow-sm transition hover:shadow"
                        style={{
                            backgroundColor: value,
                        }}
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-lg text-white font-medium tracking-wide">
                                {hexNoHash}
                            </span>
                        </span>

                        <span
                            className="inline-flex h-9 items-center rounded-full px-3 text-white transition group-hover:opacity-90"
                            style={{ backgroundColor: value }}
                        >
                            <ChevronDown className="h-6 w-6" />
                        </span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="end"
                    sideOffset={8}
                    className="w-[var(--radix-popover-trigger-width)] max-w-[92vw] rounded-2xl border border-[#E6EDF5] bg-white p-2 shadow-lg"
                >
                    <div className="p-2">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(1.75rem,1fr))] gap-4">
                            {COLOR_PRESETS.map((c) => {
                                const selected = c.toLowerCase() === value.toLowerCase();
                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => onChange(c)}  // ✅ pass color back
                                        className="relative h-9 w-9 rounded-lg border border-black/10 outline-none ring-offset-2 transition focus:ring-2 focus:ring-[#4A90E2]"
                                        style={{ backgroundColor: c }}
                                        aria-label={`Use ${c}`}
                                    >
                                        {selected && (
                                            <span className="absolute inset-0 grid place-items-center">
                                                <Check className="h-4 w-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
