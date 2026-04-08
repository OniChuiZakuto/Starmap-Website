import L from 'leaflet'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import phRegionsRaw from './ph_regions.json'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Map PH shapefile IDs → internal keys used by schoolsPerRegion
const phIdMap = {
  PH00: 'ncr',
  PH01: 'region1',
  PH02: 'region2',
  PH03: 'region3',
  PH05: 'region5',
  PH06: 'region6',
  PH07: 'region7',
  PH08: 'region8',
  PH09: 'region9',
  PH10: 'region10',
  PH11: 'region11',
  PH12: 'region12',
  PH13: 'region13',
  PH14: 'barmm',
  PH15: 'car',
  PH40: 'region4a',
  PH41: 'region4b',
}

// Shortage gap values calibrated to the heatmap thresholds in STARMap.jsx:
//   Science:  <2000 = green  |  <3500 = yellow  |  <5000 = orange  |  ≥5000 = red
//   Math:     <1500 = green  |  <2800 = yellow  |  <4000 = orange  |  ≥4000 = red
const regionGapData = {
  ncr:      { scienceGap: 1500, mathGap: 1000, level: 'low'      }, // ✅ green  — best-resourced
  region4a: { scienceGap: 1800, mathGap: 1300, level: 'low'      }, // ✅ green  — CALABARZON (near NCR)
  region7:  { scienceGap: 1900, mathGap: 1400, level: 'low'      }, // ✅ green  — Central Visayas
  region1:  { scienceGap: 2800, mathGap: 2200, level: 'medium'   }, // 🟡 yellow — Ilocos
  car:      { scienceGap: 3000, mathGap: 2400, level: 'medium'   }, // 🟡 yellow — Cordillera
  region6:  { scienceGap: 3200, mathGap: 2600, level: 'medium'   }, // 🟡 yellow — W. Visayas
  region11: { scienceGap: 1300, mathGap: 2600, level: 'medium'   }, // 🟡 yellow — Davao
  region2:  { scienceGap: 4200, mathGap: 3400, level: 'high'     }, // 🟠 orange — Cagayan Valley
  region8:  { scienceGap: 4300, mathGap: 3500, level: 'high'     }, // 🟠 orange — E. Visayas
  region5:  { scienceGap: 4500, mathGap: 1600, level: 'high'     }, // 🟠 orange — Bicol
  region10: { scienceGap: 4700, mathGap: 3700, level: 'high'     }, // 🟠 orange — N. Mindanao
  region3:  { scienceGap: 3800, mathGap: 1000, level: 'high'     }, // 🟠 orange — Central Luzon
  region13: { scienceGap: 2200, mathGap: 4300, level: 'critical' }, // 🔴 red    — Caraga
  region4b: { scienceGap: 5600, mathGap: 4600, level: 'critical' }, // 🔴 red    — MIMAROPA
  region12: { scienceGap: 5800, mathGap: 1800, level: 'critical' }, // 🔴 red    — SOCCSKSARGEN
  region9:  { scienceGap: 6200, mathGap: 5100, level: 'critical' }, // 🔴 red    — Zamboanga
  barmm:    { scienceGap: 7200, mathGap: 6000, level: 'critical' }, // 🔴 red    — BARMM (worst)
}

export const newsItems = [
  {
    id: 1,
    category: 'Teacher Shortage',
    title: 'DepEd Reports 42,000 Science Teacher Vacancies Across Philippines',
    excerpt: 'The Department of Education has released its annual report showing a critical shortage of science teachers in Mindanao and BARMM regions, with BARMM recording the highest deficit at 68% unfilled positions.',
    date: 'March 28, 2026',
    image: null,
  },
  {
    id: 2,
    category: 'Policy Update',
    title: 'New STEM Scholarship Program Targets 10,000 Future Math Teachers',
    excerpt: 'The Commission on Higher Education announced a new scholarship program aimed at producing 10,000 mathematics teachers by 2030, prioritizing graduates from underserved provinces.',
    date: 'March 20, 2026',
    image: null,
  },
  {
    id: 3,
    category: 'Innovation',
    title: 'STARMap PH Platform Helps 500 Schools Find Nearby Equipment Lenders',
    excerpt: 'Since its beta launch, the STARMap PH borrowing system has successfully connected 500 rural schools with equipment donors within a 200km radius, reducing procurement costs by an estimated ₱120 million.',
    date: 'March 15, 2026',
    image: null,
  },
  {
    id: 4,
    category: 'Research',
    title: 'Study: Students with Specialized Science Teachers Score 34% Higher in NAT',
    excerpt: 'A landmark study by UP College of Education found that students taught by subject-specialized science teachers consistently outperform those taught by generalist teachers in the National Achievement Test.',
    date: 'March 8, 2026',
    image: null,
  },
  {
    id: 5,
    category: 'Regional News',
    title: 'Caraga Region Launches Emergency Math Teacher Deployment Program',
    excerpt: 'Region XIII (Caraga) has begun deploying 200 emergency-hired math teachers to 85 remote schools following alarming NAT scores showing only 31% proficiency in basic algebra among Grade 10 students.',
    date: 'February 28, 2026',
    image: null,
  },
]

export const regionalShortages = [
  { id: 'ncr',      name: 'NCR',          ...regionGapData.ncr      },
  { id: 'region4a', name: 'Region IV-A',  ...regionGapData.region4a },
  { id: 'region7',  name: 'Region VII',   ...regionGapData.region7  },
  { id: 'region1',  name: 'Region I',     ...regionGapData.region1  },
  { id: 'car',      name: 'CAR',          ...regionGapData.car      },
  { id: 'region6',  name: 'Region VI',    ...regionGapData.region6  },
  { id: 'region11', name: 'Region XI',    ...regionGapData.region11 },
  { id: 'region2',  name: 'Region II',    ...regionGapData.region2  },
  { id: 'region8',  name: 'Region VIII',  ...regionGapData.region8  },
  { id: 'region5',  name: 'Region V',     ...regionGapData.region5  },
  { id: 'region10', name: 'Region X',     ...regionGapData.region10 },
  { id: 'region3',  name: 'Region III',   ...regionGapData.region3  },
  { id: 'region13', name: 'Region XIII',  ...regionGapData.region13 },
  { id: 'region4b', name: 'Region IV-B',  ...regionGapData.region4b },
  { id: 'region12', name: 'Region XII',   ...regionGapData.region12 },
  { id: 'region9',  name: 'Region IX',    ...regionGapData.region9  },
  { id: 'barmm',    name: 'BARMM',        ...regionGapData.barmm    },
]

// Real Philippines region boundaries from simplemaps shapefile, enriched with shortage data
export const regionsGeoJSON = {
  ...phRegionsRaw,
  features: phRegionsRaw.features.map(f => {
    const internalId = phIdMap[f.properties.id] || f.properties.id
    const gaps = regionGapData[internalId] || { scienceGap: 3000, mathGap: 2500, level: 'medium' }
    return {
      ...f,
      properties: { ...f.properties, id: internalId, ...gaps }
    }
  })
}

const makeSchools = (regionId, baseLat, baseLng, count = 40) => {
  const types = ['normal', 'normal', 'mountain', 'no_power', 'normal', 'mountain', 'normal', 'normal', 'no_power', 'normal', 'mountain', 'normal']

  const schools = []

  let attempts = 0
  const maxAttempts = count * 20

  // 🔑 find the correct region polygon ONCE
  const regionFeature = phRegionsRaw.features.find(
    f => (phIdMap[f.properties.id] || f.properties.id) === regionId
  )

  while (schools.length < count && attempts < maxAttempts) {
    attempts++

    const lat = baseLat + (Math.random() - 0.5) * 1.5
    const lng = baseLng + (Math.random() - 0.5) * 1.5

    const pt = point([lng, lat])

    // ✅ ONLY allow points inside the region
    const inside = regionFeature
      ? booleanPointInPolygon(pt, regionFeature)
      : false

    if (!inside) continue

    const i = schools.length

    schools.push({
      id: `${regionId}-school-${i + 1}`,
      name: `School ${i + 1}`,
      lat,
      lng,
      type: types[i % types.length],
      teachers: Array.from({ length: 5 }, (_, j) => ({
        name: `Teacher ${j + 1}`,
        subject: 'Science',
        years: Math.floor(Math.random() * 25) + 1,
        specialization: 'General Science',
      }))
    })
  }

  return schools
}

export const schoolsPerRegion = {
  ncr: makeSchools('ncr', 14.62, 121.05),
  car: makeSchools('car', 17.35, 121.17),
  region1: makeSchools('region1', 17.6, 120.3),
  region2: makeSchools('region2', 17.2, 121.8),
  region3: makeSchools('region3', 15.2, 120.7),
  region4a: makeSchools('region4a', 14.1, 121.5),
  region4b: makeSchools('region4b', 13.0, 120.8),
  region5: makeSchools('region5', 13.3, 123.5),
  region6: makeSchools('region6', 10.9, 122.7),
  region7: makeSchools('region7', 10.2, 123.9),
  region8: makeSchools('region8', 11.2, 124.8),
  region9: makeSchools('region9', 7.8, 122.5),
  region10: makeSchools('region10', 8.5, 124.4),
  region11: makeSchools('region11', 7.0, 126.1),
  region12: makeSchools('region12', 6.5, 124.6),
  region13: makeSchools('region13', 8.8, 125.9),
  barmm: makeSchools('barmm', 6.0, 121.0),
}

export const equipmentLenders = [
  { id: 1, name: 'Ateneo de Manila Science Lab', region: 'NCR', lat: 14.64, lng: 121.08, equipment: ['Microscopes', 'Chemistry Kits', 'Lab Equipment'], distance: null },
  { id: 2, name: 'UP Diliman Physics Dept', region: 'NCR', lat: 14.65, lng: 121.06, equipment: ['Laptops', 'Lab Equipment', 'Science Books'], distance: null },
  { id: 3, name: 'De La Salle STEM Center', region: 'NCR', lat: 14.56, lng: 120.99, equipment: ['Math Manipulatives', 'Science Books', 'Laptops'], distance: null },
  { id: 4, name: 'Mapua Tech Equipment Pool', region: 'NCR', lat: 14.59, lng: 120.98, equipment: ['Microscopes', 'Chemistry Kits'], distance: null },
  { id: 5, name: 'CLSU Science Resource Center', region: 'Region III', lat: 15.73, lng: 120.90, equipment: ['Lab Equipment', 'Science Books', 'Math Manipulatives'], distance: null },
  { id: 6, name: 'Batangas State University', region: 'Region IV-A', lat: 13.75, lng: 121.05, equipment: ['Microscopes', 'Chemistry Kits', 'Laptops'], distance: null },
  { id: 7, name: 'Xavier University Equipment Lib', region: 'Region X', lat: 8.48, lng: 124.65, equipment: ['Lab Equipment', 'Science Books'], distance: null },
  { id: 8, name: 'Ateneo de Davao STEM Hub', region: 'Region XI', lat: 7.09, lng: 125.63, equipment: ['Microscopes', 'Math Manipulatives', 'Laptops'], distance: null },
  { id: 9, name: 'MSU Science Center', region: 'BARMM', lat: 8.15, lng: 124.23, equipment: ['Science Books', 'Chemistry Kits'], distance: null },
  { id: 10, name: 'Cebu Normal University Lab', region: 'Region VII', lat: 10.29, lng: 123.90, equipment: ['Microscopes', 'Lab Equipment', 'Math Manipulatives'], distance: null },
]

export const educatorStats = {
  math: {
    needed: 42000,
    available: 28000,
    specializations: [
      { name: 'Algebra', needed: 12000, available: 7500 },
      { name: 'Calculus', needed: 8000, available: 4200 },
      { name: 'Statistics', needed: 7000, available: 5100 },
      { name: 'General Math', needed: 10000, available: 7800 },
      { name: 'Trigonometry', needed: 5000, available: 3400 },
    ]
  },
  science: {
    needed: 38000,
    available: 22000,
    specializations: [
      { name: 'Physics', needed: 9500, available: 4665 },
      { name: 'Chemistry', needed: 8500, available: 5200 },
      { name: 'Biology', needed: 10000, available: 6700 },
      { name: 'Earth Science', needed: 5500, available: 3100 },
      { name: 'General Science', needed: 4500, available: 2200 },
    ]
  }
}

export const projectionData = {
  labels: ['2026', '2027', '2028', '2029', '2030'],
  science: [45000, 43000, 40000, 37000, 33000],
  math: [38000, 36000, 33000, 30000, 27000],
  needed: [83000, 84000, 90000, 94000, 99000],
}

export const specializations = [
  'Physics',
  'Chemistry',
  'Biology',
  'Earth Science',
  'Algebra',
  'Calculus',
  'Statistics',
  'Computer Science',
  'General Science',
  'General Math',
]

export const regions = [
  'NCR',
  'CAR',
  'Region I - Ilocos',
  'Region II - Cagayan Valley',
  'Region III - Central Luzon',
  'Region IV-A - CALABARZON',
  'Region IV-B - MIMAROPA',
  'Region V - Bicol',
  'Region VI - Western Visayas',
  'Region VII - Central Visayas',
  'Region VIII - Eastern Visayas',
  'Region IX - Zamboanga Peninsula',
  'Region X - Northern Mindanao',
  'Region XI - Davao Region',
  'Region XII - SOCCSKSARGEN',
  'Region XIII - Caraga',
  'BARMM',
]
