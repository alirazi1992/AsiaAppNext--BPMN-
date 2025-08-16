import { alpha, Radio, RadioProps, styled, Switch } from "@mui/material";
import colorStore from '@/app/zustandData/color.zustand'
import useStore from "@/app/hooks/useStore";

export default function Switches({ onChange, label , checked }: any) {
    const color = useStore(colorStore, (state: any) => state)
    const PinkSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: color?.color
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: color?.color,
        },
        '& .MuiSwitch-track': {
            backgroundColor: color?.color,
        },
    }));
    return (
        <PinkSwitch {...label} checked={checked} onChange={onChange} />
    );
}
