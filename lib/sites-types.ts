export interface Site {
  slug: string;
  name: string;
  aka: string;
  area: string;
  type: string;
  depth: string;
  level: string;
  current: string;
  vis: string;
  temp: string;
  /** Hero photo URL ("" when there is no photo yet). */
  photo: string;
  gallery: string[];
  diveTypes: string[];
  topo: string;
  see: string[];
  intro: string;
  /** [topography paragraph, marine life paragraph] */
  about: string[];
  access: string;
  entry: string;
  minLevel: string;
  hazards: string;
  best: string;
  tips: string[];
  credit?: string;
  creditHref?: string;
  /** Notes compiled from public dive guides, not yet checked by the team. */
  draft?: boolean;
}
