import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { styled, useTheme } from '@mui/material/styles';
import React from 'react';
import { StyledTreeItemRoot } from './TreeRoot';
import { Box, Typography } from '@mui/material';
import useStore from '@/app/hooks/useStore';
import themeStore from '@/app/zustandData/theme.zustand';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { SvgIconProps } from '@mui/material/SvgIcon';
import colorStore from '@/app/zustandData/color.zustand';

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    bgColorForDarkMode?: string;
    color?: string;
    colorForDarkMode?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: any;
    labelText: string;
};


 export const StyledTreeItem = React.forwardRef(function StyledTreeItem(
    props: StyledTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {

    const theme = useTheme();
    const {
        bgColor,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        colorForDarkMode,
        bgColorForDarkMode,
        ...other
    } = props;

    const styleProps = {
        '--tree-view-color': theme.palette.mode !== 'dark' ? "" : "",
        '--tree-view-bg-color':
            theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    };

    const color = useStore(colorStore, (state) => state)
    const themeMode = useStore(themeStore, (state) => state)
    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0.5,
                    }}
                >
                    <Box component={LabelIcon} style={{ color: `${LabelIcon == InsertDriveFileIcon ? "#667dd1e5" : "#ffc107"}` }} sx={{ mr: 1 }} />
                    <Typography className='pr-2' style={{ color: `${!themeMode || themeMode?.stateMode ? "white" : "#463b2f"}` }} variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" style={{ color: `${color?.color}` }}>
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={styleProps}
            {...other}
            ref={ref}
        />
    );
});