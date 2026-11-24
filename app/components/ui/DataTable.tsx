"use client";
import { DataGrid } from "./DataGrid";
import type { ComponentProps } from "react";
export type { Column,DataRow } from "./DataGrid";
export function DataTable(props:ComponentProps<typeof DataGrid>){return <DataGrid {...props} density={props.density??"comfortable"}/>;}
