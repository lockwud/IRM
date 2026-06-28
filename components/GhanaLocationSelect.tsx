"use client";

import { useEffect, useState } from "react";
import { fetchGhanaLocations } from "@/lib/api-client";
import { getCommunities, getMunicipalities, ghanaLocations, ghanaRegions, type GhanaRegion } from "@/lib/ghana-locations";

function SearchSelect({ value, options, onChange, placeholder }: { value: string; options: string[]; onChange: (value: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const filtered = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  function search(value: string) {
    setQuery(value);
    setPage(1);
  }
  return <div className={`custom-select ${open ? "open-wrap" : ""}`}>
    <button type="button" className={open ? "open" : ""} onClick={() => setOpen(!open)}><span>{value || placeholder}</span><b>⌄</b></button>
    {open && <div className="custom-select-menu">
      <input className="dropdown-search" placeholder={`Search ${placeholder.toLowerCase()}...`} value={query} onChange={(event) => search(event.target.value)}/>
      {visible.map((option) => <button type="button" className={option === value ? "selected" : ""} onClick={() => { onChange(option); setOpen(false); setQuery(""); }} key={option}><span>{option}</span></button>)}
      {!visible.length && <p className="multi-select-empty">No match found</p>}
      <div className="multi-select-pagination dropdown-pagination"><button type="button" disabled={page===1} onClick={()=>setPage(page-1)}>‹</button><span>{page} / {pages}</span><button type="button" disabled={page===pages} onClick={()=>setPage(page+1)}>›</button></div>
    </div>}
  </div>;
}

export function GhanaLocationSelect({ value, onChange, names = { region: "region", municipality: "municipality", community: "community" } }: { value: { region: string; municipality: string; community: string }; onChange: (value: { region: string; municipality: string; community: string }) => void; names?: { region: string; municipality: string; community: string } }) {
  const [locations, setLocations] = useState<GhanaRegion[]>(ghanaLocations);
  useEffect(() => {
    let alive = true;
    fetchGhanaLocations().then((records) => {
      if (alive && records?.length) setLocations(records);
    });
    return () => { alive = false; };
  }, []);
  const regions = locations.map((region) => region.name);
  const municipalities = locations.find((item) => item.name === value.region)?.municipalities.map((item) => item.name) || getMunicipalities(value.region);
  const communities = locations.find((item) => item.name === value.region)?.municipalities.find((item) => item.name === value.municipality)?.communities || getCommunities(value.region, value.municipality);
  useEffect(() => {
    if (value.region && value.municipality && !municipalities.includes(value.municipality)) onChange({ ...value, municipality: "", community: "" });
    if (value.municipality && value.community && !communities.includes(value.community)) onChange({ ...value, community: "" });
  }, [value.region, value.municipality]);
  return <>
    <label className="field"><span>Region</span><input type="hidden" name={names.region} value={value.region}/><SearchSelect value={value.region} options={regions.length ? regions : ghanaRegions} placeholder="Select region" onChange={(region) => onChange({ region, municipality: "", community: "" })}/></label>
    <label className="field"><span>Municipality / District</span><input type="hidden" name={names.municipality} value={value.municipality}/><SearchSelect value={value.municipality} options={municipalities} placeholder={value.region ? "Select municipality" : "Select region first"} onChange={(municipality) => onChange({ ...value, municipality, community: "" })}/></label>
    <label className="field"><span>Community / Town</span><input type="hidden" name={names.community} value={value.community}/><SearchSelect value={value.community} options={communities} placeholder={value.municipality ? "Select community" : "Select municipality first"} onChange={(community) => onChange({ ...value, community })}/></label>
  </>;
}
