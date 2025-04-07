import { Submission } from "./SubmissionsTable"

// Format date for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export const SubmissionRow = ({
  submission,
  assessments,
}: {
  submission: Submission
  assessments: Record<string, string>
}) => {
  return (
    <tr key={submission.id}>
      <td className="id-cell">
        <span className="submission-id-pill">{submission.id.slice(0, 8)}</span>
      </td>
      <td>{formatDate(submission.created_at)}</td>
      <td className={submission.scores.depression >= 2 ? "threshold-met" : ""}>
        {submission.scores.depression}
      </td>
      <td className={submission.scores.mania >= 2 ? "threshold-met" : ""}>
        {submission.scores.mania}
      </td>
      <td className={submission.scores.anxiety >= 2 ? "threshold-met" : ""}>
        {submission.scores.anxiety}
      </td>
      <td
        className={submission.scores.substanceUse >= 1 ? "threshold-met" : ""}
      >
        {submission.scores.substanceUse}
      </td>
      <td>
        <div className="assessment-pills">
          {submission.next.map((assessmentId) => (
            <span key={assessmentId} className="assessment-pill">
              {assessments[assessmentId] || "Unknown"}
            </span>
          ))}
          {submission.next.length === 0 && (
            <span className="no-assessments">None</span>
          )}
        </div>
      </td>
    </tr>
  )
}
