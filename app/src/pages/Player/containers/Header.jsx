import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getPlayerTypeIcon, getPlayerTooltip, getOfficialHiscoresUrl, formatDate } from 'utils';
import { PageHeader, Dropdown, Button, Badge } from 'components';

const MENU_OPTIONS = [
  { label: 'Open official hiscores', value: 'OPEN_HISCORES' },
  { label: 'Change name', value: 'CHANGE_NAME' },
  // { label: 'Reset username capitalization', value: 'ASSERT_NAME' },
  { label: 'Reassign player type', value: 'ASSERT_TYPE' }
];

function Header(props) {
  const { player, isTracking, handleUpdate, handleRedirect, handleAssertName, handleAssertType } = props;

  const handleOptionSelected = option => {
    if (option.value === 'OPEN_HISCORES') {
      handleRedirect(getOfficialHiscoresUrl(player));
    } else if (option.value === 'CHANGE_NAME') {
      handleRedirect(`/names/submit/${player.displayName}`);
    } else if (option.value === 'ASSERT_NAME') {
      handleAssertName();
    } else if (option.value === 'ASSERT_TYPE') {
      handleAssertType();
    }
  };

  return (
    <>
      {player.status === 'flagged' && <FlaggedWarning {...player} />}
      {player.status === 'unranked' && <UnrankedWarning {...player} />}
      {player.status === 'archived' && <ArchivedWarning {...player} />}
      {player.status === 'banned' && <BannedWarning {...player} />}
      <PageHeader
        title={player.displayName}
        icon={getPlayerTypeIcon(player.type)}
        iconTooltip={getPlayerTooltip(player.type, player.status)}
        renderLeft={() => {
          const buildBadge = getBuildBadge(player.build);
          return (
            <>
              {buildBadge && <Badge text={buildBadge.text} hoverText={buildBadge.hoverText} />}
              {player.country && (
                <abbr
                  className="flag"
                  title={`Country: ${player.country}. Set your own flag at wiseoldman.net/flags`}
                >
                  <img src={`/img/flags/${player.country}.svg`} alt={player.country} />
                </abbr>
              )}
            </>
          );
        }}
        renderRight={() => (
          <>
            <Button text="Update" onClick={handleUpdate} loading={isTracking} />
            <Dropdown options={MENU_OPTIONS} onSelect={handleOptionSelected}>
              <button className="header__options-btn" type="button">
                <img src="/img/icons/options.svg" alt="" />
              </button>
            </Dropdown>
          </>
        )}
      />
    </>
  );
}

function ArchivedWarning() {
  return (
    <div className="warning" style={{ borderColor: '#d10f0f' }}>
      <img src="/img/runescape/icons_small/archived.png" alt="" />
      <span>
        <b>This player is archived.</b>
        <br />
        <br />
        Their previous username has been taken by another player. If you know their new username, you
        can&nbsp;
        <a href="https://wiseoldman.net/discord" target="_blank" rel="noopener noreferrer">
          contact us on Discord
        </a>
        &nbsp;&nbsp;to transfer their old data to their current username.
      </span>
    </div>
  );
}

function BannedWarning(player) {
  const { updatedAt } = player;

  return (
    <div className="warning">
      <img src="/img/runescape/icons_small/unranked.png" alt="" />
      <span>
        <b>This player is banned.</b>
        <br />
        <br />
        This player could not be found on the hiscores as of{' '}
        {formatDate(updatedAt, 'DD MMM YYYY, HH:mm')}. It was then confirmed to be banned via
        RuneMetrics.
        <br />
        You can update to re-check this status, it may take a few minutes to complete.
      </span>
    </div>
  );
}

function UnrankedWarning(player) {
  const { displayName, updatedAt } = player;

  // eslint-disable-next-line no-unused-vars
  const nameChangeURL = `/names/submit/${displayName}`;

  return (
    <div className="warning">
      <img src="/img/runescape/icons_small/unranked.png" alt="" />
      <span>
        <b>This player is unranked.</b>
        <br />
        <br />
        {`This player could not be found on the hiscores as of ${formatDate(
          updatedAt,
          'DD MMM YYYY, HH:mm'
        )}. This can mean they either changed their in-game
        name, or dropped out of the hiscores (by having very low skills).`}
        &nbsp;&nbsp;
        <a href={getOfficialHiscoresUrl(player)}>Visit their hiscores page here</a>
        <br />
        <br />
        <Link to={nameChangeURL}>Click here to submit a name change</Link>
        &nbsp; or join our &nbsp;
        <a href="https://wiseoldman.net/discord" target="_blank" rel="noopener noreferrer">
          Discord server
        </a>
        &nbsp; for help.
      </span>
    </div>
  );
}

function FlaggedWarning({ displayName }) {
  const nameChangeURL = `/names/submit/${displayName}`;

  return (
    <div className="warning" style={{ borderColor: '#e6792c' }}>
      <img src="/img/runescape/icons_small/flagged.png" alt="" />
      <span>
        <b>This player is flagged.</b>
        <br />
        <br />
        This is likely caused by an unregistered name change or they have become unranked in one or more
        skills due to lack of progress. Please check again in a few hours, if this message persists, then
        feel free to contact us on Discord for manual review.
        <br />
        <br />
        <Link to={nameChangeURL}>Click here to submit a name change</Link>
        &nbsp; or join our &nbsp;
        <a href="https://wiseoldman.net/discord" target="_blank" rel="noopener noreferrer">
          Discord server
        </a>
        &nbsp; for help.
      </span>
    </div>
  );
}

function getBuildBadge(build) {
  switch (build) {
    case 'lvl3':
      return { text: 'Level 3', hoverText: '' };
    case 'f2p':
      return { text: 'F2P', hoverText: '' };
    case 'f2p_lvl3':
      return { text: 'F2P & Level 3', hoverText: '' };
    case 'def1':
      return { text: '1 Def Pure', hoverText: '' };
    case 'hp10':
      return { text: '10 HP Pure', hoverText: '' };
    case 'zerker':
      return { text: 'Zerker', hoverText: '' };
    default:
      return null;
  }
}

Header.propTypes = {
  player: PropTypes.shape({
    username: PropTypes.string,
    displayName: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
    build: PropTypes.string,
    country: PropTypes.string
  }).isRequired,
  isTracking: PropTypes.bool.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleRedirect: PropTypes.func.isRequired,
  handleAssertName: PropTypes.func.isRequired,
  handleAssertType: PropTypes.func.isRequired
};

FlaggedWarning.propTypes = {
  displayName: PropTypes.string.isRequired
};

export default Header;
