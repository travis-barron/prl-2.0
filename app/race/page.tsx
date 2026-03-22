"use client"

import { useState } from "react"
import RaceHistory from "@/components/RaceHistory"
import Breadcrumbs from "@/components/Breadcrumbs"

export default function Races() {
    return (
        <>
            <Breadcrumbs items={{ label: 'Races', href: ""}} />
            <RaceHistory />
        </>
    )
}