import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading, Card, CardBody, CardFooter, Flex } from '@pancakeswap-libs/uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Countdown, { zeroPad } from 'react-countdown'
import Page from 'components/layout/Page'
import { usePresaleData } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchUserTokensUnclaimedDataAsync, fetchTokensLeftDataAsync, fetchUserPresaleAllowanceDataAsync, fetchUserBalanceDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { getBalanceNumber } from 'utils/formatBalance'
import UnlockWalletCard from './components/UnlockWalletCard'
import BuyCard from './components/BuyCard'
import styles from './styles/presale.module.css'

export interface PresaleProps {
    tokenMode?: boolean
}

const Header = styled.div`
  align-items: center;
  background-image: url('/images/egg/presale_banner.png');
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: auto;
  padding-top: 20px;
  text-align: center;
  background-size: cover;

  ${({ theme }) => theme.mediaQueries.lg} {
    height: 60vh;
  }
  
`

const PresaleCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
`

const CountdownText = styled.span`
  font-size: 16px;
  color: #fff;
  background: #0080FF;
  padding: 16px;
  border-radius: 16px;
  width: 230px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`

const Presale: React.FC = () => {
    const { path } = useRouteMatch()
    const TranslateString = useI18n()
    const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
    const presale = usePresaleData()

    const dispatch = useDispatch()
    const { slowRefresh } = useRefresh()
    useEffect(() => {
        if (account) {
            dispatch(fetchUserTokensUnclaimedDataAsync(account))
            dispatch(fetchUserPresaleAllowanceDataAsync(account))
            dispatch(fetchUserBalanceDataAsync(account))
        }
        dispatch(fetchTokensLeftDataAsync())
    }, [account, dispatch, slowRefresh])

    const [countdownDate, setCountdownDate] = useState(1623466800000)

    const CountdownTime = ({ days, hours, minutes, seconds, completed }) => {
        return (
            <CountdownText>
                <span>Time till Presale is Over</span>
                <span style={{ fontSize: '32px' }}>{zeroPad(days * 24 + hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
                <span>Hours:Minutes:Seconds</span>
            </CountdownText>
        )
    }

    return (
        <Page>
            <Header style={{ textAlign: 'center' }}>
                <Heading as="h1" size="xl" color="primary" mb="10px" mt="10px" style={{ textAlign: 'center' }}>
                    Andromeda Presale
                </Heading>
                <Countdown date={countdownDate} zeroPadTime={2} renderer={CountdownTime} />
            </Header>
            <div style={{ margin: '32px' }}>
                <Flex className={styles.cardContainer} justifyContent="space-between">
                    <Card className={styles.card}>
                        <CardBody>Presale Stats</CardBody>
                        <CardFooter>
                            <div className={styles.flex}>
                                <div className={styles.item}>Total ADR minted for Presale: <span className={styles.colored}>50000</span></div>
                                <div className={styles.item}>ADR Left For Presale: <span className={styles.colored}>{Math.round(getBalanceNumber(presale.tokensLeft))}</span></div>
                                <div className={styles.item}>ADR Price: <span className={styles.colored}>1 BUSD</span></div>
                                <div className={styles.item}>Max Per Wallet: <span className={styles.colored}>1000 ADR</span></div>
                            </div>
                        </CardFooter>
                    </Card>
                    <Card className={styles.card}>
                        <CardBody>Your ADR Stats</CardBody>
                        <CardFooter>{!account ? <UnlockButton mt="8px" fullWidth /> :
                            <div className={styles.flex}>
                                <div className={styles.item}>ADR you have unclaimed: <span className={styles.colored}>{getBalanceNumber(presale.tokensUnclaimed)}</span></div>
                                <div className={styles.item}>ADR you have in wallet: <span className={styles.colored}>{getBalanceNumber(presale.cakeBalance)}</span></div>
                            </div>
                        }</CardFooter>
                    </Card>
                </Flex>
                <BuyCard account={account} ethereum={ethereum} allowance={presale.userAllowance} busdBalance={presale.busdBalance} tokensUnclaimed={presale.tokensUnclaimed} tokenBalance={presale.cakeBalance} tokensLeft={presale.tokensLeft} />
            </div>
        </Page>
    )
}

export default Presale
