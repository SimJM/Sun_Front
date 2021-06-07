import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { setReferralCode } from 'utils/referrals'
import Page from 'components/layout/Page'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import Countdown, { zeroPad } from 'react-countdown'
import FarmStakingCard from './components/FarmStakingCard'
import LotteryCard from './components/LotteryCard'
import CakeStats from './components/CakeStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'
import TwitterCard from './components/TwitterCard'
import AddMartianCard from './components/AddMartianCard'

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/egg/3.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin: auto;
  padding-top: 20px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/egg/header.png');
    background-position: center bottom;
    height: calc(100vh - 64px);
    background-size: cover;
  }
  
`

const CustomHeading = styled(Heading)`
  font-family: 'Bangers', cursive;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 128px;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const CardsFullWidth = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 12;
    }
  }
`

const ComingSoonWrapper = styled.div`
  text-align: center;
`

const Home: React.FC = () => {
  const TranslateString = useI18n()
  const { account } = useWallet()

  useEffect(() => {
    setReferralCode(window.location.search, account)
  }, [account])

  const CountdownTime = ({ hours, minutes, seconds, completed }) => {
    return (
      <span>
        {zeroPad(hours)}h : {zeroPad(minutes)}m : {zeroPad(seconds)}s
      </span>
    )
  }

  return (
    <Page>

      <Hero>
        <CustomHeading as="h1" size="xl" mb="10px" style={{ color: '#FF0080', textShadow: '3px 3px 2px #fff' }}>
          {TranslateString(576, 'Andromeda Finance')}
        </CustomHeading>
        <Text fontSize="15px">
          {TranslateString(578, 'Automatic Liquidity Acquisition Yield Farm on Binance Smart Chain')}
        </Text>
        <Text fontSize="15px" style={{ marginTop: 'auto', marginBottom: '20px' }}>
          Scroll down for more
        </Text>
      </Hero>
      <div style={{ padding: '32px' }}>
        <Cards>
          <CardBody style={{ padding: 0 }}>
            <AddMartianCard />
            <br />
            <FarmStakingCard />
          </CardBody>
          <CardBody style={{ padding: 0 }}>
            <CakeStats />
            <br />
            <TotalValueLockedCard />
            <br />
            <TwitterCard />
          </CardBody>
        </Cards>
      </div>
    </Page>
  )
}

export default Home

// .