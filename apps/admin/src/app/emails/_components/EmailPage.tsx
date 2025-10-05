'use client'

import { Box } from "@mantine/core"
import { useState } from "react"
import { FetchedMail } from "../_actions/fetchAllMails"
import EmailList from "./EmailList"
import EmailSelector from "./EmailSelector"
import FilterHeader from "./FilterHeader"

const EmailPage = ({ emails }: { emails: FetchedMail[] }) => {
    const [selectedEmails, setSelectedEmails] = useState<string[]>([])
    const [filteredEmails, setFilteredEmails] = useState(emails)

    const toggleEmailSelection = (id: string) => {
        setSelectedEmails(prev =>
            prev.includes(id)
                ? prev.filter(emailId => emailId !== id)
                : [...prev, id]
        )
    }
    return (
        <>
            <FilterHeader />
            <EmailSelector
                emails={emails}
                setFilteredEmails={setFilteredEmails}
                selectedEmails={selectedEmails}
                setSelectedEmails={setSelectedEmails} />
            <Box mt="md">
                <EmailList
                    toggleEmailSelection={toggleEmailSelection}
                    selectedEmails={selectedEmails}
                    fetchedMails={filteredEmails}
                    showLabel
                />
            </Box>

        </>
    )
}

export default EmailPage