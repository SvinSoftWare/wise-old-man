import { SKILL_EXP_AT_99, isSkill } from "@wise-old-man/utils";
import Link from "next/link";
import { Label } from "../Label";
import { AchievementListItem } from "../AchievementListItem";
import { getPlayerAchievementProgress } from "~/services/wiseoldman";

interface PlayerOverviewAchievementsProps {
  username: string;
}

export async function PlayerOverviewAchievements(props: PlayerOverviewAchievementsProps) {
  const { username } = props;

  const achievementsProgress = await getPlayerAchievementProgress(username);

  const nearest99s = achievementsProgress
    .filter((a) => isSkill(a.metric) && a.threshold === SKILL_EXP_AT_99 && !a.createdAt)
    .sort((a, b) => b.absoluteProgress - a.absoluteProgress)
    .slice(0, 3);

  const recentAchievements = achievementsProgress
    .filter((a) => !!a.createdAt)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-y-3">
      {nearest99s.length > 0 && (
        <div>
          <Label className="text-xs leading-4 text-gray-200">Nearest 99s</Label>
          <div className="mt-2 flex flex-col gap-y-2">
            {nearest99s.map((a) => (
              <AchievementListItem {...a} key={a.name} />
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Link
              href={`/players/${username}/achievements`}
              className="text-xs font-medium text-gray-200 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
      )}
      {recentAchievements.length > 0 && (
        <div>
          <Label className="text-xs leading-4 text-gray-200">Recent achievements</Label>
          <div className="mt-2 flex flex-col gap-y-2">
            {recentAchievements.map((a) => (
              <AchievementListItem {...a} key={a.name} />
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Link
              href={`/players/${username}/achievements`}
              className="text-xs font-medium text-gray-200 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
