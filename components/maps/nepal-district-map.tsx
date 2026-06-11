"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

type DistrictStat = {
  district: string;
  province: string;
  followers: number;
  communities: number;
  posts: number;
};

type CoordinatePair = [number, number];

type GeoJsonGeometry = {
  type: string;
  coordinates?: unknown;
  geometries?: GeoJsonGeometry[];
};

type GeoJsonFeature = {
  type: "Feature";
  properties?: Record<string, unknown>;
  geometry?: GeoJsonGeometry;
};

type GeoJsonData = {
  type: string;
  features?: GeoJsonFeature[];
};

type SvgFeature = {
  key: string;
  districtName: string;
  paths: string[];
  stat: DistrictStat;
};

type Bounds = {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
};

type TooltipPosition = {
  x: number;
  y: number;
};

const SVG_WIDTH = 800;
const SVG_HEIGHT = 360;
const SVG_PADDING = 28;

const geoUrl = "/maps/nepal-districts.geojson";

const districtStats: DistrictStat[] = [
  {
    district: "Kathmandu",
    province: "Bagmati",
    followers: 2450,
    communities: 12,
    posts: 240,
  },
  {
    district: "Lalitpur",
    province: "Bagmati",
    followers: 1320,
    communities: 8,
    posts: 160,
  },
  {
    district: "Bhaktapur",
    province: "Bagmati",
    followers: 980,
    communities: 5,
    posts: 110,
  },
  {
    district: "Kaski",
    province: "Gandaki",
    followers: 860,
    communities: 6,
    posts: 90,
  },
  {
    district: "Chitwan",
    province: "Bagmati",
    followers: 790,
    communities: 5,
    posts: 82,
  },
  {
    district: "Morang",
    province: "Koshi",
    followers: 720,
    communities: 4,
    posts: 77,
  },
  {
    district: "Jhapa",
    province: "Koshi",
    followers: 680,
    communities: 4,
    posts: 70,
  },
  {
    district: "Rupandehi",
    province: "Lumbini",
    followers: 640,
    communities: 4,
    posts: 68,
  },
  {
    district: "Kailali",
    province: "Sudurpashchim",
    followers: 610,
    communities: 4,
    posts: 66,
  },
  {
    district: "Banke",
    province: "Lumbini",
    followers: 560,
    communities: 3,
    posts: 58,
  },
  {
    district: "Parsa",
    province: "Madhesh",
    followers: 520,
    communities: 3,
    posts: 52,
  },
  {
    district: "Dhanusha",
    province: "Madhesh",
    followers: 490,
    communities: 3,
    posts: 48,
  },
  {
    district: "Baitadi",
    province: "Sudurpashchim",
    followers: 420,
    communities: 2,
    posts: 38,
  },
  {
    district: "Surkhet",
    province: "Karnali",
    followers: 380,
    communities: 2,
    posts: 35,
  },
];

function normalizeName(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(" district", "")
    .replace("dist.", "")
    .replace(/\s+/g, " ");
}

function getDistrictName(properties: Record<string, unknown>): string {
  return String(
    properties.DISTRICT ||
      properties.DISTRICT_NAME ||
      properties.DIST_EN ||
      properties.DIST_NAME ||
      properties.DISTRICT_EN ||
      properties.ADM2_EN ||
      properties.ADM2_NAME ||
      properties.DNAME ||
      properties.NAME ||
      properties.name ||
      properties.district ||
      properties.shapeName ||
      "Unknown"
  );
}

function getDistrictFill(followers: number): string {
  if (followers >= 2000) {
    return "var(--primary)";
  }

  if (followers >= 1000) {
    return "var(--chart-2)";
  }

  if (followers >= 700) {
    return "var(--chart-3)";
  }

  if (followers >= 400) {
    return "var(--chart-4)";
  }

  return "var(--chart-5)";
}

function isCoordinatePair(value: unknown): value is CoordinatePair {
  return (
    Array.isArray(value) &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

function collectCoordinatePairs(
  value: unknown,
  result: CoordinatePair[] = []
): CoordinatePair[] {
  if (!Array.isArray(value)) {
    return result;
  }

  if (isCoordinatePair(value)) {
    result.push([value[0], value[1]]);
    return result;
  }

  value.forEach((item) => collectCoordinatePairs(item, result));

  return result;
}

function getAllCoordinatePairs(data: GeoJsonData): CoordinatePair[] {
  const pairs: CoordinatePair[] = [];

  data.features?.forEach((feature) => {
    if (feature.geometry?.coordinates) {
      collectCoordinatePairs(feature.geometry.coordinates, pairs);
    }

    feature.geometry?.geometries?.forEach((geometry) => {
      if (geometry.coordinates) {
        collectCoordinatePairs(geometry.coordinates, pairs);
      }
    });
  });

  return pairs;
}

function shouldSwapGeoJsonCoordinates(data: GeoJsonData): boolean {
  const pairs = getAllCoordinatePairs(data);

  let lngLatCount = 0;
  let latLngCount = 0;

  pairs.forEach(([first, second]) => {
    const looksLngLat =
      first >= 75 && first <= 95 && second >= 20 && second <= 35;

    const looksLatLng =
      first >= 20 && first <= 35 && second >= 75 && second <= 95;

    if (looksLngLat) {
      lngLatCount += 1;
    }

    if (looksLatLng) {
      latLngCount += 1;
    }
  });

  return latLngCount > lngLatCount;
}

function normalizeCoordinates(
  coordinates: unknown,
  shouldSwap: boolean
): unknown {
  if (!Array.isArray(coordinates)) {
    return coordinates;
  }

  if (isCoordinatePair(coordinates)) {
    const [first, second] = coordinates;

    if (shouldSwap) {
      return [second, first];
    }

    return [first, second];
  }

  return coordinates.map((item) =>
    normalizeCoordinates(item, shouldSwap)
  );
}

function normalizeGeometry(
  geometry: GeoJsonGeometry | undefined,
  shouldSwap: boolean
): GeoJsonGeometry | undefined {
  if (!geometry) {
    return undefined;
  }

  if (geometry.type === "GeometryCollection") {
    return {
      ...geometry,
      geometries: geometry.geometries
        ?.map((item) => normalizeGeometry(item, shouldSwap))
        .filter((item): item is GeoJsonGeometry => Boolean(item)),
    };
  }

  return {
    ...geometry,
    coordinates: normalizeCoordinates(
      geometry.coordinates,
      shouldSwap
    ),
  };
}

function normalizeGeoJson(data: GeoJsonData): GeoJsonData {
  const shouldSwap = shouldSwapGeoJsonCoordinates(data);

  return {
    ...data,
    features: data.features?.map((feature) => ({
      ...feature,
      geometry: normalizeGeometry(feature.geometry, shouldSwap),
    })),
  };
}

function calculateBounds(data: GeoJsonData): Bounds | null {
  const pairs = getAllCoordinatePairs(data).filter(([lng, lat]) => {
    return lng >= 75 && lng <= 95 && lat >= 20 && lat <= 35;
  });

  if (!pairs.length) {
    return null;
  }

  const lngValues = pairs.map(([lng]) => lng);
  const latValues = pairs.map(([, lat]) => lat);

  return {
    minLng: Math.min(...lngValues),
    maxLng: Math.max(...lngValues),
    minLat: Math.min(...latValues),
    maxLat: Math.max(...latValues),
  };
}

function projectCoordinate(
  coordinate: CoordinatePair,
  bounds: Bounds
): CoordinatePair {
  const [lng, lat] = coordinate;

  const lngRange = bounds.maxLng - bounds.minLng || 1;
  const latRange = bounds.maxLat - bounds.minLat || 1;

  const usableWidth = SVG_WIDTH - SVG_PADDING * 2;
  const usableHeight = SVG_HEIGHT - SVG_PADDING * 2;

  const scale = Math.min(
    usableWidth / lngRange,
    usableHeight / latRange
  );

  const mapWidth = lngRange * scale;
  const mapHeight = latRange * scale;

  const offsetX = (SVG_WIDTH - mapWidth) / 2;
  const offsetY = (SVG_HEIGHT - mapHeight) / 2;

  const x = offsetX + (lng - bounds.minLng) * scale;
  const y = offsetY + (bounds.maxLat - lat) * scale;

  return [x, y];
}

function ringToPath(ring: unknown, bounds: Bounds): string | null {
  if (!Array.isArray(ring)) {
    return null;
  }

  const points = ring.filter(isCoordinatePair);

  if (!points.length) {
    return null;
  }

  const commands = points.map((point, index) => {
    const [x, y] = projectCoordinate(point, bounds);

    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return `${commands.join(" ")} Z`;
}

function geometryToPaths(
  geometry: GeoJsonGeometry | undefined,
  bounds: Bounds
): string[] {
  if (!geometry) {
    return [];
  }

  if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
    return geometry.coordinates
      .map((ring) => ringToPath(ring, bounds))
      .filter((path): path is string => Boolean(path));
  }

  if (
    geometry.type === "MultiPolygon" &&
    Array.isArray(geometry.coordinates)
  ) {
    return geometry.coordinates.flatMap((polygon) => {
      if (!Array.isArray(polygon)) {
        return [];
      }

      return polygon
        .map((ring) => ringToPath(ring, bounds))
        .filter((path): path is string => Boolean(path));
    });
  }

  if (geometry.type === "GeometryCollection") {
    return (
      geometry.geometries?.flatMap((item) =>
        geometryToPaths(item, bounds)
      ) ?? []
    );
  }

  return [];
}

function buildSvgFeatures(
  data: GeoJsonData,
  bounds: Bounds,
  districtMap: Map<string, DistrictStat>
): SvgFeature[] {
  return (
    data.features
      ?.map((feature, index) => {
        const properties = feature.properties ?? {};
        const districtName = getDistrictName(properties);
        const stat =
          districtMap.get(normalizeName(districtName)) ??
          ({
            district: districtName,
            province: "Unknown",
            followers: 0,
            communities: 0,
            posts: 0,
          } satisfies DistrictStat);

        return {
          key: `${districtName}-${index}`,
          districtName,
          stat,
          paths: geometryToPaths(feature.geometry, bounds),
        };
      })
      .filter((feature) => feature.paths.length > 0) ?? []
  );
}

export function NepalDistrictMap() {
  const mapAreaRef = useRef<HTMLDivElement | null>(null);

  const [geoData, setGeoData] = useState<GeoJsonData | null>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeDistrict, setActiveDistrict] =
    useState<DistrictStat | null>(null);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

  const districtMap = useMemo(() => {
    return new Map(
      districtStats.map((item) => [normalizeName(item.district), item])
    );
  }, []);

  const totalFollowers = districtStats.reduce(
    (sum, item) => sum + item.followers,
    0
  );

  const topDistrict = districtStats.reduce((top, item) => {
    return item.followers > top.followers ? item : top;
  }, districtStats[0]);

  const svgFeatures = useMemo(() => {
    if (!geoData || !bounds) {
      return [];
    }

    return buildSvgFeatures(geoData, bounds, districtMap);
  }, [bounds, districtMap, geoData]);

  const updateTooltipPosition = (
    event: MouseEvent<SVGPathElement>
  ) => {
    const rect = mapAreaRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  useEffect(() => {
    const loadMap = async () => {
      try {
        setMapError(null);

        const response = await fetch(geoUrl);

        if (!response.ok) {
          throw new Error(
            `Map file not found. Status code: ${response.status}`
          );
        }

        const rawData = (await response.json()) as GeoJsonData;

        if (!rawData.features?.length) {
          throw new Error("GeoJSON loaded, but no district features found.");
        }

        const fixedData = normalizeGeoJson(rawData);
        const fixedBounds = calculateBounds(fixedData);

        if (!fixedBounds) {
          throw new Error("Map coordinates are outside Nepal bounds.");
        }

        setGeoData(fixedData);
        setBounds(fixedBounds);
      } catch (error) {
        setMapError(
          error instanceof Error
            ? error.message
            : "Unable to load Nepal map."
        );
      }
    };

    void loadMap();
  }, []);

return (
  <div className="bg-white">
    <div className="grid gap-3 pb-4 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Total Followers
        </p>

        <p className="mt-2 text-xl font-bold tracking-[-0.04em] text-foreground">
          {totalFollowers.toLocaleString()}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Top District
        </p>

        <p className="mt-2 text-xl font-bold tracking-[-0.04em] text-foreground">
          {topDistrict.district}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        <p className="text-xs font-medium text-muted-foreground">
          Tracked Districts
        </p>

        <p className="mt-2 text-xl font-bold tracking-[-0.04em] text-foreground">
          77
        </p>
      </div>
    </div>

    <div
      ref={mapAreaRef}
      className="relative h-[380px] overflow-hidden rounded-2xl bg-white"
    >
      {!geoData && !mapError ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm font-medium text-muted-foreground">
            Loading Nepal district map...
          </p>
        </div>
      ) : null}

      {mapError ? (
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-sm rounded-2xl border border-destructive/20 bg-destructive/10 p-5">
            <p className="text-sm font-bold text-destructive">
              Map could not load
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {mapError}
            </p>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Check this path:
              <br />
              <span className="font-semibold text-foreground">
                public/maps/nepal-districts.geojson
              </span>
            </p>
          </div>
        </div>
      ) : null}

      {svgFeatures.length > 0 ? (
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-full w-full"
          role="img"
          aria-label="Nepal district map"
        >
          <rect
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            fill="white"
          />

          {svgFeatures.map((feature) =>
            feature.paths.map((path, pathIndex) => (
              <path
                key={`${feature.key}-${pathIndex}`}
                d={path}
                fill={getDistrictFill(feature.stat.followers)}
                stroke="white"
                strokeWidth={1.1}
                className="cursor-pointer transition-all duration-150 hover:opacity-85"
                onMouseEnter={(event) => {
                  setActiveDistrict(feature.stat);
                  updateTooltipPosition(event);
                }}
                onMouseMove={updateTooltipPosition}
                onMouseLeave={() => {
                  setActiveDistrict(null);
                  setTooltipPosition(null);
                }}
              >
                <title>
                  {`${feature.stat.district} • ${feature.stat.followers.toLocaleString()} followers`}
                </title>
              </path>
            ))
          )}
        </svg>
      ) : null}

      {activeDistrict && tooltipPosition ? (
        <div
          className="pointer-events-none absolute z-20 min-w-[190px] rounded-xl border border-border bg-white px-3 py-2 shadow-lg"
          style={{
            left: tooltipPosition.x + 14,
            top: tooltipPosition.y,
            transform: "translateY(-50%)",
          }}
        >
          <p className="text-sm font-bold text-foreground">
            {activeDistrict.district}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {activeDistrict.province}
          </p>

          <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border pt-2">
            <div>
              <p className="text-[10px] text-muted-foreground">
                Followers
              </p>

              <p className="mt-0.5 text-xs font-bold text-foreground">
                {activeDistrict.followers.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground">
                Communities
              </p>

              <p className="mt-0.5 text-xs font-bold text-foreground">
                {activeDistrict.communities}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground">
                Posts
              </p>

              <p className="mt-0.5 text-xs font-bold text-foreground">
                {activeDistrict.posts}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
);
}