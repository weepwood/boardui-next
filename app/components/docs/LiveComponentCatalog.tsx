"use client";
import {memo} from "react";
import {docs} from "@/lib/docs/registry";
import {CatalogCard,type CatalogCardProps} from "./CatalogCard";
import {ComponentCatalog} from "./ComponentCatalog";
import type {CatalogGroups} from "./catalog-data";
const LiveCard=memo(function LiveCard(props:CatalogCardProps){
 return <CatalogCard {...props} renderPreview={props.template?undefined:docs[props.slug]?.preview}/>;
});
export function LiveComponentCatalog({available}:{available:CatalogGroups}){
 return <ComponentCatalog available={available} Card={LiveCard}/>;
}
